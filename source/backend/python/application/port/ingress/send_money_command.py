from application.domain.model.account import Account
from application.domain.model.money import Money
from common import validation

class SendMoneyCommand:
    def __init__(self, source_account: Account, target_account: Account, money: Money):
        self.source_account = source_account
        self.target_account = target_account
        self.money = money
        validation.SendMoneyCommand(source_account, target_account, money)
