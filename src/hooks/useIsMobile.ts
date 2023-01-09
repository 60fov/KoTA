import { useLayoutEffect, useState } from 'react';

const useIsMobile_BAD = (): boolean => {
    const [isMobile, setIsMobile] = useState(false);

    useLayoutEffect(() => {
        const UA = navigator.userAgent;
        const hasTouchScreen =
            /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);

        setIsMobile(hasTouchScreen)
    }, []);

    return isMobile;
};

export default useIsMobile_BAD;
