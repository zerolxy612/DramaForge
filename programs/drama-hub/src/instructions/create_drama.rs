use anchor_lang::prelude::*;

use crate::error::DramaError;
use crate::state::{Drama, DramaCreated, DramaStatus};

#[derive(Accounts)]
#[instruction(title: String, genesis_uri: String)]
pub struct CreateDrama<'info> {
    #[account(
        init,
        payer = creator,
        space = Drama::SPACE,
        seeds = [b"drama", creator.key().as_ref(), title.as_bytes()],
        bump
    )]
    pub drama: Account<'info, Drama>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateDrama>,
    title: String,
    genesis_uri: String,
    target_duration: u64,
) -> Result<()> {
    // 验证输入
    require!(!title.is_empty(), DramaError::TitleEmpty);
    require!(title.len() <= Drama::MAX_TITLE_LEN, DramaError::TitleTooLong);
    require!(!genesis_uri.is_empty(), DramaError::GenesisUriEmpty);
    require!(
        genesis_uri.len() <= Drama::MAX_URI_LEN,
        DramaError::GenesisUriTooLong
    );
    require!(target_duration > 0, DramaError::InvalidTargetDuration);

    let drama = &mut ctx.accounts.drama;
    let clock = Clock::get()?;

    drama.creator = ctx.accounts.creator.key();
    drama.title = title.clone();
    drama.genesis_uri = genesis_uri;
    drama.target_duration = target_duration;
    drama.current_duration = 0;
    drama.status = DramaStatus::Ongoing;
    drama.node_count = 0;
    drama.created_at = clock.unix_timestamp;
    drama.bump = ctx.bumps.drama;

    emit!(DramaCreated {
        drama: drama.key(),
        creator: drama.creator,
        title,
        target_duration,
    });

    msg!("Drama created: {}", drama.key());

    Ok(())
}
