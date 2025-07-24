import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Iter "mo:base/Iter";

actor BitLoan {
  // Types
  type UserId = Principal;
  
  type Loan = {
    id: Text;
    collateralAmount: Float;
    borrowedAmount: Float;
    borrowedToken: Text;
    collateralRatio: Float;
    liquidationThreshold: Float;
    interestRate: Float;
    dueDate: Text;
    status: Text; // "active" | "repaid" | "liquidated"
    riskScore: ?Nat;
  };

  // State
  private stable var loans : [(Text, Loan)] = [];
  private var loansMap = HashMap.HashMap<Text, Loan>(10, Text.equal, Text.hash);
  
  // Initialize the state
  system func preupgrade() {
    loans := Iter.toArray(loansMap.entries());
  };
  
  system func postupgrade() {
    for ((id, loan) in loans.vals()) {
      loansMap.put(id, loan);
    };
  };

  // Deposit collateral
  public shared(msg) func depositCollateral(amount: Float) : async Text {
    let caller = msg.caller;
    Debug.print("Depositing collateral: " # Float.toText(amount) # " from " # Principal.toText(caller));
    
    // In a real implementation, you would handle the token transfer here
    
    return "Collateral deposited successfully";
  };
  
  // Borrow assets
  public shared(msg) func borrow(amount: Float, token: Text) : async Text {
    let caller = msg.caller;
    Debug.print("Borrowing: " # Float.toText(amount) # " " # token # " by " # Principal.toText(caller));
    
    // In a real implementation, you would:
    // 1. Check if user has sufficient collateral
    // 2. Calculate risk and interest rate
    // 3. Transfer the tokens
    // 4. Create a loan record
    
    return "Assets borrowed successfully";
  };
  
  // Repay loan
  public shared(msg) func repay(loanId: Text, amount: Float) : async Text {
    let caller = msg.caller;
    Debug.print("Repaying: " # Float.toText(amount) # " for loan " # loanId # " by " # Principal.toText(caller));
    
    // In a real implementation, you would:
    // 1. Check if the loan exists
    // 2. Handle the repayment logic
    // 3. Update the loan status if fully repaid
    
    return "Loan repaid successfully";
  };
  
  // Get user loans
  public query func getUserLoans(userId: Principal) : async [Loan] {
    Debug.print("Getting loans for user: " # Principal.toText(userId));
    
    // In a real implementation, you would filter loans by the user
    return [];
  };
  
  // AI risk assessment (mock)
  public func assessRisk(userId: Principal, collateralAmount: Float, requestedAmount: Float) : async Nat {
    Debug.print("Assessing risk for: " # Principal.toText(userId));
    
    // In a real implementation, this would use more sophisticated risk models
    // This is just a simple mock
    let riskScore : Nat = 75; // Lower is riskier
    
    return riskScore;
  };
} 