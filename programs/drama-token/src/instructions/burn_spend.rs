use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, Token, TokenAccount};
use crate::state::{TokenConfig, SpendType, SpendBurned};
use crate::error::TokenError;

#[derive(Accounts)]
pub struct BurnSpend<'info> {
    #[account(
        mut,
        seeds = [b"token_config"],
        bump = token_config.bump
    )]
    pub token_config: Account<'info, TokenConfig>,

    #[account(
        mut,
        seeds = [b"drap_mint"],
        bump
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    /// 消耗积分的用户（必须签名授权）
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<BurnSpend>,
    amount: u64,
    spend_type: SpendType,
) -> Result<()> {
    require!(amount > 0, TokenError::InvalidAmount);

    // 检查余额
    require!(
        ctx.accounts.user_token_account.amount >= amount,
        TokenError::InsufficientBalance
    );

    let token_config = &mut ctx.accounts.token_config;

    // 更新总销毁量
    token_config.total_burned = token_config
        .total_burned
        .checked_add(amount)
        .ok_or(TokenError::Overflow)?;

    // 销毁代币
    token::burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        amount,
    )?;

    emit!(SpendBurned {
        user: ctx.accounts.user.key(),
        amount,
        spend_type,
        total_burned: token_config.total_burned,
    });

    Ok(())
}
