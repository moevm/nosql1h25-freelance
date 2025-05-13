from typing import Union, List, Any
from datetime import datetime
from bson import ObjectId

def serialize_mongo(obj: Union[dict, List[dict]]) -> Union[dict, List[dict]]:
    if isinstance(obj, list):
        return [serialize_mongo_doc(item) for item in obj]
    return serialize_mongo_doc(obj)

def serialize_mongo_doc(doc: Any) -> Any:
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if key == "_id":
                result["id"] = str(value)
            else:
                result[key] = serialize_mongo_doc(value)
        return result
    elif isinstance(doc, list):
        return [serialize_mongo_doc(item) for item in doc]
    elif isinstance(doc, ObjectId):
        return str(doc)
    elif isinstance(doc, datetime):
        return doc.isoformat()
    else:
        return doc
