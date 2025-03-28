import csv
from faker import Faker
import random
from datetime import datetime, timedelta
import itertools

fake = Faker()
random.seed(42)
Faker.seed(42)

# Configuration
QUANTITIES = {
    'users': 10,
    'suppliers': 10,
    'products': 200,
    'branches': 10,
    'stock': 200,
    'orders': 200,
    'order_items': 60,
    'entries': 150,
    'entry_items': 750,
    'user_logs': 100,
    'stock_logs': 200
}

data_store = {k: [] for k in QUANTITIES.keys()}

# Helper functions
def create_users():
    for uid in range(1, QUANTITIES['users']+1):
        data_store['users'].append({
            "user_id": uid,
            "username": fake.unique.user_name(),
            "user_password": fake.password(length=12),
            "level_of_access": random.choices(
                ['Admin', 'Manager', 'Staff'],
                weights=[0.1, 0.3, 0.6]
            )[0]
        })

def create_suppliers():
    for sid in range(1, QUANTITIES['suppliers']+1):
        data_store['suppliers'].append({
            "supplier_id": sid,
            "supplier_name": fake.unique.company()
        })

def create_products():
    for pid in range(1, QUANTITIES['products']+1):
        mrp = round(random.uniform(10, 1000), 2)
        data_store['products'].append({
            "product_id": f"P{pid:04d}",
            "product_brand": fake.company(),
            "product_name": fake.unique.word().title(),
            "description": fake.sentence(),
            "category": random.choice([
                'Electronics', 'Apparel', 
                'Home & Kitchen', 'Grocery'
            ]),
            "mrp": mrp,
            "SP": round(mrp * random.uniform(0.7, 0.9), 2)
        })

def create_branches():
    for bid in range(1, QUANTITIES['branches']+1):
        data_store['branches'].append({
            "branch_id": f"B{bid:04d}",
            "branch_name": f"{fake.city()} {fake.street_name()} Branch"
        })

# def create_stock():
#     products = [p['product_id'] for p in data_store['products']]
#     branches = [b['branch_id'] for b in data_store['branches']]
    
#     for _ in range(QUANTITIES['stock']):
#         data_store['stock'].append({
#             "product_id": random.choice(products),
#             "branch_id": random.choice(branches),
#             "quantity_of_item": random.randint(0, 500)
#         })

def create_orders():
    # Create orders and items concurrently
    order_counter = 1
    item_counter = 0
    
    while item_counter < QUANTITIES['order_items']:
        order = {
            "order_id": order_counter,
            "branch_id": random.choice(data_store['branches'])['branch_id'],
            "user_id": random.choice(data_store['users'])['user_id'],
            "order_time": fake.date_time_between('-1y', 'now')
        }
        data_store['orders'].append(order)
        
        # Add 1-5 items per order
        num_items = random.randint(1, 5)
        for _ in range(num_items):
            if item_counter >= QUANTITIES['order_items']:
                break
            product = random.choice(data_store['products'])
            data_store['order_items'].append({
                "order_id": order_counter,
                "product_id": product['product_id'],
                "quantity_of_item": random.randint(1, 10),
                "SP": product['SP']
            })
            item_counter += 1
        
        order_counter += 1

def create_entries():
    entry_counter = 1
    item_counter = 0
    
    while item_counter < QUANTITIES['entry_items']:
        entry = {
            "entry_id": entry_counter,
            "supplier_id": random.choice(data_store['suppliers'])['supplier_id'],
            "branch_id": random.choice(data_store['branches'])['branch_id'],
            "user_id": random.choice(data_store['users'])['user_id'],
            "entry_time": fake.date_time_between('-6m', 'now')
        }
        data_store['entries'].append(entry)
        
        # Add 3-10 items per entry
        num_items = random.randint(3, 10)
        for _ in range(num_items):
            if item_counter >= QUANTITIES['entry_items']:
                break
            product = random.choice(data_store['products'])
            data_store['entry_items'].append({
                "entry_id": entry_counter,
                "product_id": product['product_id'],
                "quantity_of_item": random.randint(10, 100),
                "cost_of_item": round(product['mrp'] * random.uniform(0.4, 0.7), 2)
            })
            item_counter += 1
        
        entry_counter += 1

# def create_logs():
    # # User logs
    # for log_id in range(1, QUANTITIES['user_logs']+1):
    #     user = random.choice(data_store['users'])
    #     login = fake.date_time_between('-1y', 'now')
    #     data_store['user_logs'].append({
    #         "log_id": log_id,
    #         "user_id": user['user_id'],
    #         "login_time": login,
    #         "logout_time": login + timedelta(
    #             hours=random.randint(1, 8),
    #             minutes=random.randint(0, 59)
    #         )
    #     })
    
    # # Stock logs
    # for log_id in range(1, QUANTITIES['stock_logs']+1):
    #     stock = random.choice(data_store['stock'])
    #     data_store['stock_logs'].append({
    #         "log_id": log_id,
    #         "product_id": stock['product_id'],
    #         "branch_id": stock['branch_id'],
    #         "quantity_change": random.randint(1, 50),
    #         "change_type": random.choices(
    #             ['INCREASE', 'DECREASE'],
    #             weights=[0.6, 0.4]
    #         )[0],
    #         "change_time": fake.date_time_between(
    #             start_date='-6m', 
    #             end_date='now'
    #         )
    #     })

# Generate all data
create_users()
create_suppliers()
create_products()
create_branches()
# create_stock()
create_orders()
create_entries()
# create_logs()

# Export to CSV
tables_mapping = {
    'User_Table': ('users', ['user_id', 'username', 'user_password', 'level_of_access']),
    'Supplier_Table': ('suppliers', ['supplier_id', 'supplier_name']),
    'Product_Table': ('products', ['product_id', 'product_brand', 'product_name', 
                                 'description', 'category', 'mrp', 'SP']),
    'Branch_Table': ('branches', ['branch_id', 'branch_name']),
    # 'Stock_Table': ('stock', ['product_id', 'branch_id', 'quantity_of_item']),
    'Order_Table': ('orders', ['order_id', 'branch_id', 'user_id', 'order_time']),
    'Order_Items': ('order_items', ['order_id', 'product_id', 'quantity_of_item', 'SP']),
    'Entry_Table': ('entries', ['entry_id', 'supplier_id', 'branch_id', 'user_id', 'entry_time']),
    'Entry_Items': ('entry_items', ['entry_id', 'product_id', 'quantity_of_item', 'cost_of_item']),
    # 'User_Log': ('user_logs', ['log_id', 'user_id', 'login_time', 'logout_time']),
    # 'Stock_Log': ('stock_logs', ['log_id', 'product_id', 'branch_id', 
                            #    'quantity_change', 'change_type', 'change_time'])
}

for table_name, (data_key, fields) in tables_mapping.items():
    with open(f'{table_name}.csv', 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(data_store[data_key])

print("All CSV files generated successfully!")
