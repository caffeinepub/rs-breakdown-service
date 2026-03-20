import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Service Request data type
  public type ServiceRequest = {
    id : Nat;
    name : Text;
    phone : Text;
    location : Text;
    service : Text;
    price : Text;
    status : Text;
    timestamp : Int;
  };

  stable var nextRequestId : Nat = 1;
  stable var requestsArray : [ServiceRequest] = [];

  let requests = List.fromArray<ServiceRequest>(requestsArray);

  system func preupgrade() {
    requestsArray := requests.toArray();
  };

  system func postupgrade() {
    requestsArray := [];
  };

  // Public request submission - no auth required (guests can submit)
  public shared ({ caller }) func submitRequest(name : Text, phone : Text, location : Text, service : Text, price : Text) : async Nat {
    let request : ServiceRequest = {
      id = nextRequestId;
      name;
      phone;
      location;
      service;
      price;
      status = "Pending";
      timestamp = 0;
    };

    requests.add(request);
    let currentId = nextRequestId;
    nextRequestId += 1;
    currentId;
  };

  // Admin-only: Get all service requests
  public query ({ caller }) func getRequests() : async [ServiceRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all requests");
    };
    requests.toArray();
  };

  // Admin-only: Update request status
  public shared ({ caller }) func updateStatus(id : Nat, newStatus : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update request status");
    };

    let updatedRequests = requests.map<ServiceRequest, ServiceRequest>(
      func(request) {
        if (request.id == id) {
          { request with status = newStatus };
        } else {
          request;
        };
      }
    );

    requests.clear();
    requests.addAll(updatedRequests.values());
    true;
  };
};
