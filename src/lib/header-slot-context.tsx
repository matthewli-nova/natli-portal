import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface HeaderSlotState {
  centerSlot: ReactNode;
  rightSlot: ReactNode;
  setCenterSlot: (node: ReactNode) => void;
  setRightSlot: (node: ReactNode) => void;
}

const HeaderSlotContext = createContext<HeaderSlotState>({
  centerSlot: null,
  rightSlot: null,
  setCenterSlot: () => {},
  setRightSlot: () => {},
});

export function HeaderSlotProvider({ children }: { children: ReactNode }) {
  const [centerSlot, setCenterSlot] = useState<ReactNode>(null);
  const [rightSlot, setRightSlot] = useState<ReactNode>(null);
  return (
    <HeaderSlotContext.Provider value={{ centerSlot, rightSlot, setCenterSlot, setRightSlot }}>
      {children}
    </HeaderSlotContext.Provider>
  );
}

export const useHeaderSlot = () => useContext(HeaderSlotContext);

/** Renders children into the center of PortalHeader. Unmounts on cleanup. */
export function HeaderCenter({ children }: { children: ReactNode }) {
  const { setCenterSlot } = useHeaderSlot();
  useEffect(() => {
    setCenterSlot(children);
    return () => setCenterSlot(null);
  });
  return null;
}

/** Renders children into the right of PortalHeader. Unmounts on cleanup. */
export function HeaderRight({ children }: { children: ReactNode }) {
  const { setRightSlot } = useHeaderSlot();
  useEffect(() => {
    setRightSlot(children);
    return () => setRightSlot(null);
  });
  return null;
}
