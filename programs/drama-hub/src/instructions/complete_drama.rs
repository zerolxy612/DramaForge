use anchor_lang::prelude::*;

use crate::error::DramaError;
use crate::state::{Drama, DramaCompleted, DramaStatus};

#[derive(Accounts)]
pub struct CompleteDrama<'info> {
    #[account(
        mut,
        constraint = drama.creator == authority.key() @ DramaError::Unauthorized
    )]
    pub drama: Account<'info, Drama>,

    /// 必须是剧集创建者
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<CompleteDrama>) -> Result<()> {
    let drama = &mut ctx.accounts.drama;

    require!(!drama.is_completed(), DramaError::DramaAlreadyCompleted);

    drama.status = DramaStatus::Completed;

    emit!(DramaCompleted {
        drama: drama.key(),
        final_duration: drama.current_duration,
    });

    msg!("Drama manually completed: {}", drama.key());

    Ok(())
}
