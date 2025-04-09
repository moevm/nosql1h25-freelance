from typing import Union, List


def serialize_mongo(obj: Union[dict, List[dict]]) -> Union[dict, List[dict]]:
    if isinstance(obj, list):
        return [serialize_mongo_doc(item) for item in obj]
    return serialize_mongo_doc(obj)


def serialize_mongo_doc(doc: dict) -> dict:
    doc = dict(doc)
    if '_id' in doc:
        doc['id'] = str(doc['_id'])
        del doc['_id']
    # можно добавить сериализацию ObjectId и вложенных объектов тут при необходимости
    return doc
