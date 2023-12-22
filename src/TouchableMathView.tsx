
import React, { useCallback, useRef, useState } from 'react';
import { Animated, I18nManager, SectionListProps } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent, TapGestureHandler, TapGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import { MathViewProps } from 'react-native-math-view';
import MathStrings from './math';
import MathItem from './MathItem';
import MathSectionList from './MathSectionList';
import styles from './styles';

export function TouchableMathView({ math }: MathViewProps) {
    const [editing, setEditable] = useState(false);
    const ref = useRef(null);
    const reactToTouch = useCallback((e: PanGestureHandlerGestureEvent | TapGestureHandlerStateChangeEvent) => {
        if (!editing) {
            setEditable(true);
            return;
        }

        ref.current && ref.current.__test(e.nativeEvent.x, e.nativeEvent.y);
    }, [ref, editing]);

    const tap = useRef();
    const pan = useRef();

    return (
        <TapGestureHandler
            onHandlerStateChange={reactToTouch}
            ref={tap}
        >
            <Animated.View collapsable={false}>
                <PanGestureHandler
                    onGestureEvent={reactToTouch}
                    ref={pan}
                    maxDeltaX={20}
                //waitFor={[tap]}
                >
                    <Animated.View collapsable={false}>
                        <MathItem
                            math={math}
                            action={editing ? 'edit' : 'none'}
                            ref={ref}
                            containerStyle={[styles.flexContainer, { justifyContent: I18nManager.isRTL ? 'flex-end' : 'flex-start' }]}
                        />
                    </Animated.View>
                </PanGestureHandler>
            </Animated.View>
        </TapGestureHandler>
    );
}

export default function TouchableMathList(props: Partial<SectionListProps<typeof MathStrings>>) {
    return (
        <MathSectionList
            {...props}
            style={styles.default}
            renderItem={({ item: math }) => <TouchableMathView math={math} />}
            keyExtractor={(m, i) => `TouchableMathView${i}`}
        />
    );
}