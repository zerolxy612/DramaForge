use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use crate::state::{TokenConfig, TokenInitialized};
use crate::error::TokenError;

#[derive(Accounts)]
pub struct InitializeToken<'info> {
    #[account(
        init,
        payer = authority,
        space = TokenConfig::SPACE,
        seeds = [b"token_config"],
        bump
    )]
    pub token_config: Account<'info, TokenConfig>,

    #[account(
        init,
        payer = authority,
        mint::decimals = 6,
        mint::authority = token_config,
        mint::freeze_authority = token_config,
        seeds = [b"drap_mint"],
        bump
    )]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<InitializeToken>) -> Result<()> {
    msg!("Initializing DRAMA Token (DRAP)...");
    
    let token_config = &mut ctx.accounts.token_config;

    require!(!token_config.initialized, TokenError::AlreadyInitialized);

    token_config.authority = ctx.accounts.authority.key();
    token_config.mint = ctx.accounts.mint.key();
    token_config.name = "DRAMA Points".to_string();
    token_config.symbol = "DRAP".to_string();
    token_config.decimals = 6;
    token_config.total_minted = 0;
    token_config.total_burned = 0;
    token_config.initialized = true;
    token_config.bump = ctx.bumps.token_config;

    emit!(TokenInitialized {
        mint: token_config.mint,
        authority: token_config.authority,
        name: token_config.name.clone(),
        symbol: token_config.symbol.clone(),
    });

    Ok(())
}

