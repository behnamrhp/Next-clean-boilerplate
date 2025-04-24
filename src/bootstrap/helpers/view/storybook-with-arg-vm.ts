import { IBaseVM } from "reactvvm";

/**
 * To use with mvvm library to make a vm based on props so you can pass the result to the view
 * @param vmObj All properties which view needs to get from vm.
 * @returns Vm which is suitable to be passed to the view
 * @example     const vm = getArgVM(globalData.parsedProps.vm); 
    return <Button vm={vm} memoizedByVM={false} />;
 */
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
