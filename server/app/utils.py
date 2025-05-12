from typing import Union, List
from datetime import datetime
from bson import ObjectId

def serialize_mongo(obj: Union[dict, List[dict]]) -> Union[dict, List[dict]]:
    if isinstance(obj, list):
        return [serialize_mongo_doc(item) for item in obj]
    return serialize_mongo_doc(obj)

def serialize_mongo_doc(doc: Union[dict, object]) -> dict:
    if isinstance(doc, dict):
        doc = dict(doc)
        result = {}
        for key, value in doc.items():
            if key == "_id":
                result["id"] = str(value)
            else:
                result[key] = serialize_mongo_doc(value)
        return result
    if isinstance(doc, list):
        return [serialize_mongo_doc(item) for item in doc]
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, datetime):
        return doc.isoformat()
    return doc