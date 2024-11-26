import IBaseVM from "@/bootstrap/helpers/vm/i-base-vm";

const getArgVM = <IVM>(vmObj: IVM) => {
  class VM implements IBaseVM<IVM> {
    useVM(): IVM {
      return {
        ...vmObj,
      };
    }
  }
  return new VM();
};

export default getArgVM;
