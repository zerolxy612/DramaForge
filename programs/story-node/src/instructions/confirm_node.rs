use anchor_lang::prelude::*;

use crate::error::StoryNodeError;
use crate::state::{NodeConfirmed, StoryNode};
use drama_hub::state::Drama;

#[derive(Accounts)]
#[instruction(frame_uri: String)]
pub struct ConfirmNode<'info> {
    #[account(
        init,
        payer = contributor,
        space = StoryNode::SPACE,
        seeds = [
            b"node",
            drama.key().as_ref(),
            &drama.node_count.to_le_bytes()
        ],
        bump
    )]
    pub node: Account<'info, StoryNode>,

    #[account(mut)]
    pub drama: Account<'info, Drama>,

    /// 可选的父节点（用于验证）
    /// CHECK: 父节点账户，只读验证
    pub parent_node: Option<Account<'info, StoryNode>>,

    #[account(mut)]
    pub contributor: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ConfirmNode>, frame_uri: String, duration: u16) -> Result<()> {
    // 验证输入
    require!(!frame_uri.is_empty(), StoryNodeError::FrameUriEmpty);
    require!(
        frame_uri.len() <= StoryNode::MAX_URI_LEN,
        StoryNodeError::FrameUriTooLong
    );
    require!(duration > 0, StoryNodeError::InvalidDuration);

    let drama = &ctx.accounts.drama;
    let node = &mut ctx.accounts.node;
    let clock = Clock::get()?;

    // 计算深度
    let (depth, parent_nodes) = if let Some(parent) = &ctx.accounts.parent_node {
        (parent.depth + 1, vec![parent.key()])
    } else {
        (0, vec![])
    };

    node.drama = drama.key();
    node.parent_nodes = parent_nodes;
    node.contributor = ctx.accounts.contributor.key();
    node.frame_uri = frame_uri;
    node.asset_mints = vec![];
    node.duration = duration;
    node.depth = depth;
    node.visit_count = 0;
    node.child_count = 0;
    node.timestamp = clock.unix_timestamp;
    node.node_index = drama.node_count;
    node.bump = ctx.bumps.node;

    emit!(NodeConfirmed {
        node: node.key(),
        drama: drama.key(),
        contributor: node.contributor,
        duration,
        depth,
    });

    msg!(
        "Node confirmed: {} for drama: {}",
        node.key(),
        drama.key()
    );

    Ok(())
}
