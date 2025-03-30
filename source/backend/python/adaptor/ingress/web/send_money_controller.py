from Tools.scripts.cleanfuture import dryrun

from application.port.ingress.send_money_command import SendMoneyCommand
from application.port.ingress.send_money_use_case import SendMoneyUseCase

class SendMoneyController:
    def __init__(self, input_args: SendMoneyCommand):
        self.input_args = input_args
        self.send_money_use_case = SendMoneyUseCase()

    def send_money(self) -> bool:
        command = SendMoneyCommand(self.input_args.source_account,
                                   self.input_args.target_account,
                                   self.input_args.money)
        return self.send_money_use_case.send_money(command)