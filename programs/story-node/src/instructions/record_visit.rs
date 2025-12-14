use anchor_lang::prelude::*;

use crate::state::{NodeVisited, StoryNode};

#[derive(Accounts)]
pub struct RecordVisit<'info> {
    #[account(mut)]
    pub node: Account<'info, StoryNode>,

    pub visitor: Signer<'info>,
}

pub fn handler(ctx: Context<RecordVisit>) -> Result<()> {
    let node = &mut ctx.accounts.node;

    node.visit_count = node.visit_count.saturating_add(1);

    emit!(NodeVisited {
        node: node.key(),
        visitor: ctx.accounts.visitor.key(),
        visit_count: node.visit_count,
    });

    Ok(())
}
