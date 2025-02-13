from pymongo import MongoClient

url = "mongodb://127.0.0.1:27017/"
name_db = "helloDB"
name_collection = "helloCollection"


def write_to_database():
    client = MongoClient(url)
    try:
        db = client[name_db]
        collection = db[name_collection]

        data = collection.insert_one({"message": "HelloWorld"})
        print("Data was successfully written to the database:", data.acknowledged, data.inserted_id)
    except Exception as error:
        print("An error has occurred:", error)
    finally:
        client.close()


def read_from_database():
    client = MongoClient(url)
    try:
        db = client[name_db]
        collection = db[name_collection]

        data = collection.find_one()
        if data:
            print("Data from the database:", data.get("message"))
        else:
            print("No data found in the collection.")
    except Exception as error:
        print("An error has occurred:", error)
    finally:
        client.close()


if __name__ == "__main__":
    write_to_database()
    read_from_database()
