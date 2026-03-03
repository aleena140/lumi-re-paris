import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

actor {
  type Perfume = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    scentNotes : [Text];
    tagline : Text;
  };

  type CartItem = {
    perfumeId : Nat;
    quantity : Nat;
  };

  type Order = {
    user : Principal;
    items : [CartItem];
    totalPrice : Nat;
  };

  var nextPerfumeId = 7;

  let perfumes = Map.fromIter<Nat, Perfume>([
    (
      1,
      {
        id = 1;
        name = "Midnight Breeze";
        description = "A mysterious blend of dark florals and amber. Evokes the elegance of midnight garden parties.";
        price = 4500;
        category = "Unisex";
        scentNotes = ["Amber", "Jasmine", "Bergamot"];
        tagline = "Let the night take you.";
      },
    ),
    (
      2,
      {
        id = 2;
        name = "Sunny Citrus";
        description = "Bursting with energy, this scent combines zesty oranges, lemons, and a hint of vanilla.";
        price = 3200;
        category = "Women's";
        scentNotes = ["Orange", "Lemon", "Vanilla"];
        tagline = "Catch the sunshine.";
      },
    ),
    (
      3,
      {
        id = 3;
        name = "Mountain Mist";
        description = "Cool, fresh notes reminiscent of alpine air and wildflowers. Perfect for active lifestyles.";
        price = 4000;
        category = "Men's";
        scentNotes = ["Pine", "Lavender", "Mint"];
        tagline = "Breathe in adventure.";
      },
    ),
    (
      4,
      {
        id = 4;
        name = "Velvet Rose";
        description = "Classic floral fragrance with a modern twist. Rich layers of rose intertwine with warm spices.";
        price = 3700;
        category = "Women's";
        scentNotes = ["Rose", "Cinnamon", "Vanilla"];
        tagline = "Timeless elegance, redefined.";
      },
    ),
    (
      5,
      {
        id = 5;
        name = "Oceanic Haze";
        description = "Crisp aquatic notes meet salty sea breeze and fresh citrus. Captures the essence of coastal escapes.";
        price = 3800;
        category = "Unisex";
        scentNotes = ["Sea Salt", "Lime", "Vetiver"];
        tagline = "Dive into freshness.";
      },
    ),
    (
      6,
      {
        id = 6;
        name = "Spiced Cedar";
        description = "Earthy blend of cedarwood base, spiced with hints of cinnamon, clove, and citrus.";
        price = 4300;
        category = "Men's";
        scentNotes = ["Cedarwood", "Clove", "Grapefruit"];
        tagline = "Bold. Warm. Inviting.";
      },
    ),
  ].values());

  let carts = Map.empty<Principal, List.List<CartItem>>();
  let orders = List.empty<Order>();

  public shared ({ caller }) func addToCart(perfumeId : Nat, quantity : Nat) : async () {
    if (not perfumes.containsKey(perfumeId)) {
      Runtime.trap("Perfume not found");
    };

    let currentCart = switch (carts.get(caller)) {
      case (null) {
        let newCart = List.empty<CartItem>();
        carts.add(caller, newCart);
        newCart;
      };
      case (?cart) { cart };
    };

    currentCart.add({
      perfumeId;
      quantity;
    });
  };

  public shared ({ caller }) func removeFromCart(perfumeId : Nat) : async () {
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("No cart found for user") };
      case (?cart) {
        let updatedCart = cart.filter(func(item) { item.perfumeId != perfumeId });
        carts.add(caller, updatedCart);
      };
    };
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.toArray() };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    carts.remove(caller);
  };

  public shared ({ caller }) func placeOrder() : async () {
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("No cart found for user") };
      case (?cart) { cart };
    };

    if (cart.isEmpty()) {
      Runtime.trap("Cart is empty");
    };

    var totalPrice = 0;
    for (item in cart.values()) {
      switch (perfumes.get(item.perfumeId)) {
        case (null) { Runtime.trap("Perfume not found") };
        case (?perfume) {
          totalPrice += perfume.price * item.quantity;
        };
      };
    };

    let order : Order = {
      user = caller;
      items = cart.toArray();
      totalPrice;
    };

    orders.add(order);
    carts.remove(caller);
  };

  public query ({ caller }) func getOrderHistory() : async [Order] {
    orders.toArray();
  };

  public query ({ caller }) func getAllPerfumes() : async [Perfume] {
    perfumes.values().toArray();
  };

  public query ({ caller }) func getPerfumeById(id : Nat) : async Perfume {
    switch (perfumes.get(id)) {
      case (null) { Runtime.trap("Perfume not found") };
      case (?perfume) { perfume };
    };
  };
};
