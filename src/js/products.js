class Products {
  constructor(
    type,
    name,
    price,
    description,
    manufacturer,
    max_speed,
    weight,
    wheel_size,
    quantity
  ) {
    this.type = type;
    this.name = name;
    this.price = price;
    this.description = description;
    this.manufacturer = manufacturer;
    this.max_speed = max_speed;
    this.weight = weight;
    this.wheel_size = wheel_size;
    this.quantity = quantity;
  }

  toFirestore = (product) => {
    return {
      type: product.type,
      name: product.name,
      price: product.price,
      description: product.description,
      manufacturer: product.manufacturer,
      max_speed: product.max_speed,
      weight: product.weight,
      wheel_size: product.wheel_size,
      quantity: product.quantity,
    };
  };
  fromFirestore = (snapshot, options) => {
    const data = snapshot.data(options);
    return new City(
      data.type,
      data.name,
      data.price,
      data.description,
      data.manufacturer,
      data.max_speed,
      data.weight,
      data.wheel_size,
      data.quantity
    );
  };
}
