import sys
import stripe
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

stripe.api_key = "sk_test_SI2Bj21CR96ipxvy1BfZsXkB00pKOEpTxC"


def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)


@app.route('/charge', methods=['post'])
def start():
    if not request.data:  # 检测是否有数据
        return 'fail'
    the_key = request.data
    the_key_json = json.loads(the_key)
    # 把区获取到的数据转为JSON格式。
    token=stripe.Token.retrieve(the_key_json["token"])

    # customer
    customer=stripe.Customer.create(
        description="Customer for hoope@example.com",
        source=token
    )

    # 创建order
    order=stripe.Order.create(
        currency="aud",
        email="jenny.rosen@example.com",
        items=[
            {
                "type": "sku",
                "parent": "sku_G3ovyQOCMft53O",
            },
        ],
        shipping={
            "name": "Jenny Rosen",
            "address": {
                "line1": "1234 Main Street",
                "city": "San Francisco",
                "state": "CA",
                "country": "US",
                "postal_code": "94111",
            },
        },
    )

    # 进行刷卡
    charge=stripe.Charge.create(
        amount=100,#等于后台sku价格
        currency="aud",
        order=order['id'],
        customer=customer['id']
    )

    #列出order
    orders=stripe.Order.list()
    eprint(orders)

    return jsonify(charge)
    # 返回JSON数据。


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
