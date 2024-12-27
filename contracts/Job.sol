// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Job {
    enum Status {
        Pending,
        ApplicantSelected,
        Completed
    }
    
    address public owner;
    string public description;
    uint public price;
    uint public numberOfDays;
    Status public status;
    address public selectedApplicant;
    address[] public applicants;
    
    event Applied(address applicant);
    event ApplicantSelected(address applicant);
    event JobCompleted(address applicant);
    event PaymentWithdrawn(address to, uint amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlySelectedApplicant() {
        require(msg.sender == selectedApplicant, "Only the selected applicant can perform this action");
        _;
    }
    
    constructor(
        address _owner,
        string memory _description,
        uint _price,
        uint _numberOfDays
    ) payable {
        require(msg.value == _price, "Must fund job with exact price");
        owner = _owner;
        description = _description;
        price = _price;
        numberOfDays = _numberOfDays;
        status = Status.Pending;
    }
    
    function applyForJob() public {
        require(msg.sender != owner, "Owner cannot apply");
        require(status == Status.Pending, "Job is not accepting applications");
        require(!hasApplied(msg.sender), "Already applied");
        
        applicants.push(msg.sender);
        emit Applied(msg.sender);
    }
    
    function selectApplicant(address applicant) public onlyOwner {
        require(status == Status.Pending, "Can't select applicant at this stage");
        require(hasApplied(applicant), "Address has not applied");
        
        selectedApplicant = applicant;
        status = Status.ApplicantSelected;
        emit ApplicantSelected(applicant);
    }
    
    function completeJob() public onlyOwner {
        require(status == Status.ApplicantSelected, "No applicant selected");
        require(selectedApplicant != address(0), "No applicant selected");
        
        status = Status.Completed;
        emit JobCompleted(selectedApplicant);
    }
    
    function withdrawPayment() public onlySelectedApplicant {
        require(status == Status.Completed, "Job not completed");
        
        uint amount = price;
        payable(selectedApplicant).transfer(amount);
        emit PaymentWithdrawn(selectedApplicant, amount);
    }
    
    function getApplicants() public view returns (address[] memory) {
        return applicants;
    }
    
    function hasApplied(address applicant) internal view returns (bool) {
        for (uint i = 0; i < applicants.length; i++) {
            if (applicants[i] == applicant) {
                return true;
            }
        }
        return false;
    }
}