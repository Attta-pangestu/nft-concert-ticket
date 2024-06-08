// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenMaster is ERC721 {
    address public owner;
    uint256 public totalOccasions;
    uint256 public totalSupply;

    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }
    // save occasion object
    mapping(uint256 => Occasion) occasions;
    // save all occasion and seat taken
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    // save seat that is already taken on spesific occasion
    mapping(uint256 => uint256[]) seatsTaken; 
    // save buyer thats is bought   
    mapping(uint256 => mapping(address => bool) ) public hasBought; 


    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    } 

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {

        totalOccasions++;
        // simpan ke blockchain
        occasions[totalOccasions] = Occasion(totalOccasions, _name, _cost, _maxTickets, _maxTickets, _date, _time, _location  );
    }

    function getOccasion(uint256 _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    function mint(uint256 _id, uint256 _seat) public payable {
        // make sure id not zero 
        require(_id != 0);
        require(_id <= totalOccasions);

        // ETH sent is greater than cost... 
        require(msg.value >= occasions[_id].cost);
        
        // require that the seat is not taken, and the seats is exist
        require(seatTaken[_id][_seat] == address(0) );
        require(_seat <= occasions[_id].maxTickets );


        // sync to Occassion struct
        occasions[_id].tickets -= 1;
        seatTaken[_id][_seat] = msg.sender;
        seatsTaken[_id].push(_seat);
        hasBought[_id][msg.sender] = true; 
        
        // generate tokenID
        totalSupply++; 
        _safeMint(msg.sender , totalSupply ); 
    }
    
    function getSeatsToken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    function withDraw()public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }

    
}
