from money import Money

class Account:
    def __init__(self, account_id: str, balance: Money):
        self.account_id = account_id
        self.balance = balance

    def get_account_id(self):
        return  self.account_id

    def get_balance(self):
        return self.balance

    def deposit(self, money: Money) -> bool:
        """入金処理
        自身の口座に入金される
        Args:
            money(Money): 入金するお金クラス

        Returns:
            bool: 成功ならTrue, 失敗ならFalse
        """
        self.balance = Money.add(self.balance, money)
        return True

    def withdraw(self, money: Money) -> bool:
        """引き出し処理
        自身の口座からお金が引き出しされる
        Args:
            money(Money): 出金するお金クラス

        Returns:
            bool: 成功ならTrue, 失敗ならFalse
        """
        if self._may_withdraw(money=money) is False:
            return False

        self.balance = Money.subtract(self.balance, money)
        return True

    def _may_withdraw(self, money: Money) -> bool:
        """引出可能チェック
        口座から引き出した場合に残額が0未満にならないかを確認する
        Args:
            money(Money): お金クラス

        Returns:
            bool: 成功ならTrue, 失敗ならFalse
        """
        return Money.subtract(self.balance, money).is_positive()