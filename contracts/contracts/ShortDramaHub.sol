// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "openzeppelin-solidity/access/Ownable.sol";

contract ShortDramaHub is Ownable {
    struct Drama {
        address author;
        string title;
        string scriptCid;
        string mediaCid;
        uint256 createdAt;
    }

    event Published(
        uint256 indexed dramaId,
        address indexed author,
        string title,
        string scriptCid,
        string mediaCid
    );

    Drama[] private _dramas;

    constructor(address initialOwner) Ownable(initialOwner) {}

    function publish(
        string calldata title,
        string calldata scriptCid,
        string calldata mediaCid
    ) external returns (uint256 dramaId) {
        dramaId = _dramas.length;
        _dramas.push(
            Drama({
                author: msg.sender,
                title: title,
                scriptCid: scriptCid,
                mediaCid: mediaCid,
                createdAt: block.timestamp
            })
        );

        emit Published(dramaId, msg.sender, title, scriptCid, mediaCid);
    }

    function getDrama(uint256 dramaId) external view returns (Drama memory) {
        require(dramaId < _dramas.length, "Invalid drama id");
        return _dramas[dramaId];
    }

    function totalDramas() external view returns (uint256) {
        return _dramas.length;
    }
}
