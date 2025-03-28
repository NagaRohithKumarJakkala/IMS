import csv
import random
from datetime import datetime, timedelta

from faker import Faker

fake = Faker('en_US')  # or 'en_GB', 'fr_FR'
random.seed(42)
Faker.seed(42)

# Configuration
QUANTITIES = {
    "users": 15,
    "suppliers": 45,
    "products": 1000,
    "branches": 15,
    "orders": 300,
    "order_items": 1200,
    "entries": 150,
    "entry_items": 750,
    "user_logs": 1000,
}

data_store = {k: [] for k in QUANTITIES.keys()}


# Helper functions
def create_users():
    for uid in range(1, QUANTITIES["users"] + 1):
        data_store["users"].append(
            {
                "username": fake.unique.user_name(),
                "user_password": fake.password(length=12),
                "level_of_access": random.choices(
                    ["Admin", "Manager", "Staff"], weights=[0.1, 0.3, 0.6]
                )[0],
            }
        )


def create_suppliers():
    for sid in range(1, QUANTITIES["suppliers"] + 1):
        data_store["suppliers"].append(
            {"supplier_id": sid, "supplier_name": fake.unique.company()}
        )


# def create_products():
#     for pid in range(1, QUANTITIES["products"] + 1):
#         mrp = round(random.uniform(10, 1000), 2)
#         data_store["products"].append(
#             {
#                 "product_id": f"P{pid:05d}",
#                 "product_brand": fake.company(),
#                 "product_name": fake.word().title(),
#                 "description": fake.sentence(),
#                 "category": random.choice(
#                     ["Electronics", "Apparel", "Home & Kitchen", "Grocery"]
#                 ),
#                 "mrp": mrp,
#                 "SP": round(mrp * random.uniform(0.7, 0.9), 2),
#             }
#         )

def create_products():
    grocery_items = [
        ("Wheat Flour", "Flours", "Finely ground wheat used for baking and cooking."),
        ("Rice", "Grains", "A staple grain, rich in carbohydrates."),
        ("Sugar", "Sweeteners", "Sweet crystalline substance for desserts and beverages."),
        ("Salt", "Condiments", "Essential seasoning for cooking."),
        ("Milk", "Dairy", "Fresh dairy product, rich in calcium."),
        ("Eggs", "Dairy", "Protein-rich farm eggs for various recipes."),
        ("Butter", "Dairy", "Dairy product used in cooking and baking."),
        ("Peanut Butter", "Spreads", "Protein-rich spread for bread and snacks."),
        ("Olive Oil", "Oils", "Healthy oil for cooking and dressing."),
        ("Tea", "Beverages", "Aromatic beverage made from tea leaves."),
        ("Coffee", "Beverages", "Brewed drink from roasted coffee beans."),
        ("Lentils", "Pulses", "Protein-packed legumes for soups and curries."),
        ("Spices", "Spices", "Assorted spices to enhance flavors."),
        ("Pasta", "Grains", "Italian staple made from durum wheat."),
        ("Cereal", "Breakfast Items", "Nutritious breakfast food."),
        ("Honey", "Sweeteners", "Natural sweetener with health benefits."),
        ("Oats", "Breakfast Items", "Whole grain, good for heart health."),
        ("Canned Beans", "Canned Goods", "Ready-to-use beans for cooking."),
        ("Tomato Sauce", "Sauces", "Rich tomato-based cooking sauce."),
        ("Corn Flakes", "Breakfast Items", "Crispy corn-based cereal for breakfast."),
        ("Chia Seeds", "Superfoods", "Nutrient-dense seeds for a healthy diet."),
        ("Soy Milk", "Dairy Alternatives", "Plant-based milk rich in protein."),
        ("Yogurt", "Dairy", "Probiotic-rich dairy product."),
        ("Green Tea", "Beverages", "Antioxidant-rich tea for a healthy lifestyle."),
        ("Coconut Oil", "Oils", "Versatile oil for cooking and skincare."),
        ("Whole Wheat Bread", "Bakery", "Healthy whole wheat bread for daily nutrition."),
        ("Almond Butter", "Spreads", "Nut-based spread, rich in healthy fats."),
        ("Brown Sugar", "Sweeteners", "Unrefined sugar with a deep caramel flavor."),
        ("Chili Powder", "Spices", "Ground dried chilies for adding heat to dishes."),
        ("Mustard Seeds", "Spices", "Essential for making mustard and pickles."),
    ]

    # Ensure we have at least 1000 products
    products_needed = QUANTITIES["products"]
    product_list = []
    
    while len(product_list) < products_needed:
        product_name, category, description = random.choice(grocery_items)
        unique_name = f"{product_name} {len(product_list) + 1}"  # Ensure uniqueness
        product_list.append((unique_name, category, description))

    for pid, (product_name, category, description) in enumerate(product_list, start=1):
        mrp = round(random.uniform(10, 500), 2)  # Adjusted for groceries
        data_store["products"].append(
            {
                "product_id": f"P{pid:05d}",
                "product_brand": fake.company(),
                "product_name": product_name,
                "description": description,
                "category": category,
                "mrp": mrp,
                "SP": round(mrp * random.uniform(0.7, 0.9), 2),
            }
        )



def create_branches():
    for bid in range(1, QUANTITIES["branches"] + 1):
        data_store["branches"].append(
            {
                "branch_id": f"B{bid:04d}",
                "branch_name": f"{fake.city()} {fake.street_name()} Branch",
            }
        )


def create_orders():
    for _ in range(QUANTITIES["orders"]):
        order = {
            "branch_id": random.choice(data_store["branches"])["branch_id"],
            "user_id": random.randint(
                1, QUANTITIES["users"]
            ),  # Use a random number for user_id
            "order_time": fake.date_time_between("-1y", "now"),
        }
        data_store["orders"].append(order)


def create_order_items():
    for order_index, order in enumerate(data_store["orders"]):
        num_items = random.randint(1, 3)
        for _ in range(num_items):
            if len(data_store["order_items"]) >= QUANTITIES["order_items"]:
                break
            product = random.choice(data_store["products"])
            data_store["order_items"].append(
                {
                    "order_id": order_index + 1,
                    "product_id": product["product_id"],
                    "quantity_of_item": random.randint(1, 10),
                    "SP": product["SP"],
                }
            )


def create_entries():
    for _ in range(QUANTITIES["entries"]):
        entry = {
            "supplier_id": random.choice(data_store["suppliers"])["supplier_id"],
            "branch_id": random.choice(data_store["branches"])["branch_id"],
            "user_id": random.randint(
                1, QUANTITIES["users"]
            ),  # Use a random number for user_id
            "entry_time": fake.date_time_between("-6m", "now"),
        }
        data_store["entries"].append(entry)


def create_entry_items():
    for entry_index, entry in enumerate(data_store["entries"]):
        num_items = random.randint(3, 10)
        for _ in range(num_items):
            if len(data_store["entry_items"]) >= QUANTITIES["entry_items"]:
                break
            product = random.choice(data_store["products"])
            data_store["entry_items"].append(
                {
                    "entry_id": entry_index + 1,
                    "product_id": product["product_id"],
                    "quantity_of_item": random.randint(10, 100),
                    "cost_of_item": round(product["mrp"] * random.uniform(0.4, 0.7), 2),
                }
            )


def create_user_logs():
    for _ in range(QUANTITIES["user_logs"]):
        user = random.choice(data_store["users"])
        login = fake.date_time_between("-1y", "now")
        data_store["user_logs"].append(
            {
                "user_id": random.randint(1, QUANTITIES["users"]),
                "login_time": login,
                "logout_time": login
                + timedelta(hours=random.randint(1, 8), minutes=random.randint(0, 59)),
            }
        )


# Generate all data
create_users()
create_suppliers()
create_products()
create_branches()
create_orders()
create_order_items()
create_entries()
create_entry_items()
create_user_logs()

# Export to CSV
tables_mapping = {
    "User_Table": ("users", ["username", "user_password", "level_of_access"]),
    "Supplier_Table": ("suppliers", ["supplier_id", "supplier_name"]),
    "Product_Table": (
        "products",
        [
            "product_id",
            "product_brand",
            "product_name",
            "description",
            "category",
            "mrp",
            "SP",
        ],
    ),
    "Branch_Table": ("branches", ["branch_id", "branch_name"]),
    "Order_Table": ("orders", ["branch_id", "user_id", "order_time"]),
    "Order_Items": (
        "order_items",
        ["order_id", "product_id", "quantity_of_item", "SP"],
    ),
    "Entry_Table": ("entries", ["supplier_id", "branch_id", "user_id", "entry_time"]),
    "Entry_Items": (
        "entry_items",
        ["entry_id", "product_id", "quantity_of_item", "cost_of_item"],
    ),
    "User_Log": ("user_logs", ["user_id", "login_time", "logout_time"]),
}

for table_name, (data_key, fields) in tables_mapping.items():
    with open(f"{table_name}.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(data_store[data_key])

print("All CSV files generated successfully!")
