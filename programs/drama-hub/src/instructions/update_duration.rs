use anchor_lang::prelude::*;

use crate::error::DramaError;
use crate::state::{Drama, DramaCompleted, DramaProgressUpdated, DramaStatus};

#[derive(Accounts)]
pub struct UpdateDuration<'info> {
    #[account(mut)]
    pub drama: Account<'info, Drama>,

    /// 调用者（通常是 story_node 程序或管理员）
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateDuration>, added_duration: u64) -> Result<()> {
    let drama = &mut ctx.accounts.drama;

    require!(!drama.is_completed(), DramaError::DramaAlreadyCompleted);

    drama.current_duration = drama.current_duration.saturating_add(added_duration);
    drama.node_count = drama.node_count.saturating_add(1);

    emit!(DramaProgressUpdated {
        drama: drama.key(),
        added_duration,
        current_duration: drama.current_duration,
    });

    // 自动完成检查
    if drama.current_duration >= drama.target_duration {
        drama.status = DramaStatus::Completed;

        emit!(DramaCompleted {
            drama: drama.key(),
            final_duration: drama.current_duration,
        });

        msg!("Drama completed: {}", drama.key());
    }

    Ok(())
}
