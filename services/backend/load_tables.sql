load data local infile 'Branch_Table.csv' into table Branch_Table fields terminated by ',' enclosed by '"' lines terminated by '\n' ignore 1 rows;
load data local infile 'Product_Table.csv' into table Product_Table fields terminated by ',' enclosed by '"' lines terminated by '\n' ignore 1 rows;
load data local infile 'Supplier_Table.csv' into table Supplier_Table fields terminated by ',' enclosed by '"' lines terminated by '\n' ignore 1 rows;
load data local infile 'Order_Table.csv' into table Order_Table fields terminated by ',' enclosed by '"' lines terminated by '\n' ignore 1 rows;
load data local infile 'Order_Items.csv' into table Order_Items fields terminated by ',' enclosed by '"' lines terminated by '\n' ignore 1 rows;
load data local infile 'Entry_Table.csv' into table Entry_Table fields terminated by ',' enclosed by '"' lines terminated by '\n' ignore 1 rows;
load data local infile 'Entry_Items.csv' into table Entry_Items fields terminated by ',' enclosed by '"' lines terminated by '\n' ignore 1 rows;