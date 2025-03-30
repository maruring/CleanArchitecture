# お金に関するドメインモデル
from __future__ import annotations

class Money:
    def __init__(self, amount:int):
        self.amount = amount
    
    def is_positive(self) -> bool:
        return self.amount >= 0
    
    def is_negative(self) -> bool:
        return self.amount < 0
    
    @staticmethod
    def add(money_a: Money, money_b: Money) -> Money:
        return Money(money_a.amount + money_b.amount)
    
    @staticmethod
    def subtract(money_a: Money, money_b: Money) -> Money:
            return Money(money_a.amount - money_b.amount)