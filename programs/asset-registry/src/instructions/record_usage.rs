use anchor_lang::prelude::*;
use crate::state::{AssetUsage, AssetUsed};

#[derive(Accounts)]
pub struct RecordUsage<'info> {
    #[account(
        mut,
        seeds = [b"asset", asset_usage.mint.as_ref()],
        bump = asset_usage.bump
    )]
    pub asset_usage: Account<'info, AssetUsage>,

    /// 使用该资产的节点
    /// CHECK: 节点账户引用
    pub node: AccountInfo<'info>,

    pub user: Signer<'info>,
}

pub fn handler(ctx: Context<RecordUsage>) -> Result<()> {
    let asset_usage = &mut ctx.accounts.asset_usage;
    
    asset_usage.usage_count += 1;

    emit!(AssetUsed {
        mint: asset_usage.mint,
        node: ctx.accounts.node.key(),
        usage_count: asset_usage.usage_count,
    });

    Ok(())
}
