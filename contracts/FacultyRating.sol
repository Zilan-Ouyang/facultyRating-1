pragma solidity 0.5.4;

contract FacultyRating {
    // This contract is about getting feedback of students on each faculty. 
    // Students give their feedback based on their statisfaction percentage.
    address public admin;
    
    // Bool is for to check that each student in the whitelist can only vote once.
    // Only students must be able to vote for the teachers.
    mapping (address => bool) private whiteList; // Students list
    
    struct rateInfo {
        uint256 feedBackCounter;
        uint8 average; // average of all the vote
        bool flag; // to check whether exist or not
        
    }
    mapping (address => rateInfo ) private teachers;

    event addToWhitelit(address indexed author, address _student);

    constructor(address[] memory _students, address [] memory _teachers) public {
        admin = msg.sender;
        
        for(uint256 i =0; i< _students.length ; i++) {
            whiteList[_students[i]] = true;
        }
        
        for(uint256 i=0; i< _teachers.length; i++) {
            teachers[_teachers[i]].feedBackCounter = 0;
            teachers[_teachers[i]].average = 0;
            teachers[_teachers[i]].flag = true;
        }
    }
    
    modifier onlyAdmin {
        require(msg.sender == admin, 'Request denied, you are not admin!');
        _;
    }
    
    function isWhiteListed(address _student) public view returns(bool) {
        require(_student != address(0), "Account is zero address");
        return whiteList[_student];
    }
    
    function addWhiteList(address _student) public onlyAdmin{
        require(!isWhiteListed(_student), "The account is already exist");
        whiteList[_student] = true;
        emit addToWhitelit(msg.sender, _student);
    }
    
    function removeFromWhiteList(address _student) public onlyAdmin {
        require(isWhiteListed(_student), "The account is not on whiteList.");
        delete whiteList[_student];
    }
    
    function sendFeedBack(address _teacher,uint8 _feedBack ) public {
        require(isWhiteListed(msg.sender), "You must be on the whitelist in order to send feedback.");
        require(teachers[_teacher].flag == true , "this teacher does not exist");
        if(teachers[_teacher].feedBackCounter == 0) {
            teachers[_teacher].feedBackCounter += 1;
            teachers[_teacher].average = _feedBack;
        }else {
            ((teachers[_teacher].feedBackCounter * teachers[_teacher].average) + _feedBack) / (teachers[_teacher].feedBackCounter+1);
            teachers[_teacher].feedBackCounter +=1;
        }
        
    }
    
    function getRates(address _teacher) public view onlyAdmin returns(uint8)  {
       require(teachers[_teacher].flag == true , "this teacher does not exist");
       return teachers[_teacher].average;
    }
}

