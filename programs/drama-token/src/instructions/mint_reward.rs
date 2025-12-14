use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount};
use crate::state::{TokenConfig, RewardType, RewardMinted};
use crate::error::TokenError;

#[derive(Accounts)]
pub struct MintReward<'info> {
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

    /// CHECK: 接收奖励的用户
    pub user: AccountInfo<'info>,

    /// 必须是授权的后端服务或管理员
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<MintReward>,
    amount: u64,
    reward_type: RewardType,
) -> Result<()> {
    require!(amount > 0, TokenError::InvalidAmount);

    let token_config = &mut ctx.accounts.token_config;
    
    // 验证授权
    require!(
        ctx.accounts.authority.key() == token_config.authority,
        TokenError::Unauthorized
    );

    // 更新总发行量
    token_config.total_minted = token_config
        .total_minted
        .checked_add(amount)
        .ok_or(TokenError::Overflow)?;

    // Mint 代币到用户账户
    let seeds = &[b"token_config".as_ref(), &[token_config.bump]];
    let signer_seeds = &[&seeds[..]];

    token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.token_config.to_account_info(),
            },
            signer_seeds,
        ),
        amount,
    )?;

    emit!(RewardMinted {
        user: ctx.accounts.user.key(),
        amount,
        reward_type,
        total_minted: token_config.total_minted,
    });

    Ok(())
}
