use anchor_lang::prelude::*;
use crate::state::{AssetUsage, AssetType, AssetRegistered};
use crate::error::AssetError;

#[derive(Accounts)]
#[instruction(name: String, metadata_uri: String, asset_type: AssetType)]
pub struct RegisterAsset<'info> {
    #[account(
        init,
        payer = creator,
        space = AssetUsage::SPACE,
        seeds = [b"asset", mint.key().as_ref()],
        bump
    )]
    pub asset_usage: Account<'info, AssetUsage>,

    /// 资产对应的 Mint 账户（由 Metaplex 创建）
    /// CHECK: 这个账户会在外部通过 Metaplex 创建
    pub mint: AccountInfo<'info>,

    /// 来源剧集
    /// CHECK: 剧集账户引用
    pub drama: AccountInfo<'info>,

    /// 来源节点
    /// CHECK: 节点账户引用
    pub node: AccountInfo<'info>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<RegisterAsset>,
    name: String,
    metadata_uri: String,
    asset_type: AssetType,
) -> Result<()> {
    // 验证
    require!(!name.is_empty(), AssetError::NameEmpty);
    require!(name.len() <= AssetUsage::MAX_NAME_LEN, AssetError::NameTooLong);
    require!(!metadata_uri.is_empty(), AssetError::MetadataUriEmpty);
    require!(metadata_uri.len() <= AssetUsage::MAX_URI_LEN, AssetError::MetadataUriTooLong);

    let asset_usage = &mut ctx.accounts.asset_usage;
    let clock = Clock::get()?;

    asset_usage.mint = ctx.accounts.mint.key();
    asset_usage.asset_type = asset_type;
    asset_usage.creator = ctx.accounts.creator.key();
    asset_usage.origin_drama = ctx.accounts.drama.key();
    asset_usage.origin_node = ctx.accounts.node.key();
    asset_usage.name = name.clone();
    asset_usage.metadata_uri = metadata_uri;
    asset_usage.usage_count = 1; // 首次注册算一次使用
    asset_usage.created_at = clock.unix_timestamp;
    asset_usage.bump = ctx.bumps.asset_usage;

    emit!(AssetRegistered {
        mint: asset_usage.mint,
        asset_type,
        creator: asset_usage.creator,
        origin_drama: asset_usage.origin_drama,
        name,
    });

    Ok(())
}
