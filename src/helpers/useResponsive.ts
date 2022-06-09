import { useMediaQuery } from 'react-responsive';

export enum EBreakPoint {
  xs = 376,
  sm = 576,
  md = 800,
  lg = 992,
  xl = 1200,
  xxl = 1400,
  ipad = 768,
}

export const useResposive = () => {
  const isAfter376 = useMediaQuery({ maxWidth: EBreakPoint.xs });
  const isFrom376To576 = useMediaQuery({ minWidth: EBreakPoint.xs, maxWidth: EBreakPoint.sm });
  const isFrom576To800 = useMediaQuery({ minWidth: EBreakPoint.sm, maxWidth: EBreakPoint.md });
  const isFrom800To992 = useMediaQuery({ minWidth: EBreakPoint.md, maxWidth: EBreakPoint.lg });
  const isFrom992 = useMediaQuery({ minWidth: EBreakPoint.md });
  const isFromMobile = useMediaQuery({ minWidth: EBreakPoint.ipad });
  const isFrom1200 = useMediaQuery({ minWidth: EBreakPoint.xl });

  return {
    isAfter376,
    isFrom576To800,
    isFrom800To992,
    isFrom992,
    isFrom376To576,
    isFromMobile,
    isFrom1200,
  };
};
