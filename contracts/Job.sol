// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Job {
    // TODO: Add status PaymentWithdrawn
    enum Status {
        NotFunded,
        Pending,
        ApplicantSelected,
        Completed
    }
    
    address private owner;
    string private description;
    uint private price;
    uint private numberOfDays;
    Status private status;
    address private selectedApplicant;
    address[] private applicants;

    function getOwner() public view returns (address) {
        return owner;
    }

    function getDescription() public view returns (string memory) {
        return description;
    }

    function getPrice() public view returns (uint) {
        return price;
    }

    function getNumberOfDays() public view returns (uint) {
        return numberOfDays;
    }

    function getStatus() public view returns (Status) {
        return status;
    }

    function getSelectedApplicant() public view returns (address) {
        return selectedApplicant;
    }

    function getApplicants() public view returns (address[] memory) {
        return applicants;
    }
    
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
    ){
        owner = _owner;
        description = _description;
        price = _price;
        numberOfDays = _numberOfDays;
        status = Status.NotFunded;
    }

    function fundJob() public onlyOwner payable {
        require(msg.value == price, "Must fund job with exact price");
        require(status == Status.NotFunded, "Job is already funded");
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
        // TODO: Add requirement that status is not already completed
        require(status == Status.ApplicantSelected, "No applicant selected");
        require(selectedApplicant != address(0), "No applicant selected");
        
        status = Status.Completed;
        emit JobCompleted(selectedApplicant);
    }
    
    function withdrawPayment() public onlySelectedApplicant {
        // TODO: Add requirement that status is not already PaymentWithdrawn
        require(status == Status.Completed, "Job not completed");
        
        uint amount = price;
        payable(selectedApplicant).transfer(amount);
        emit PaymentWithdrawn(selectedApplicant, amount);
    }

    // TODO: add external that checks if the job is in status PaymentWithdrawn
    
    function hasApplied(address applicant) internal view returns (bool) {
        for (uint i = 0; i < applicants.length; i++) {
            if (applicants[i] == applicant) {
                return true;
            }
        }
        return false;
    }
}