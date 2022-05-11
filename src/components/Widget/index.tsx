import React, {useRef} from 'react';
import { View, TouchableOpacity } from 'react-native';
import {ChatTeardropDots} from 'phosphor-react-native'
import BottomSheet from '@gorhom/bottom-sheet';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
 

import { styles } from './styles';
import { theme } from '../../theme';
import { Options } from '../Options';

import { feedbackTypes } from '../../utils/feedbackTypes';
import { Form } from '../Form';
import { Sucess } from '../Sucess';

export type FeedbackType = keyof typeof feedbackTypes;

function Widget() {
    const [feedbackType, setFeedbackType] = React.useState<FeedbackType | null>(null);
    const [feedbackSent, setFeedbackSent] = React.useState(false);

    const bottomSheetRef = useRef<BottomSheet>(null);

    function handleOpen() {
        bottomSheetRef.current?.expand();
    }

    function handleRestarFeedback() {
        setFeedbackType(null);
        setFeedbackSent(false);
    }

    function handleFeedbackSent() {
        setFeedbackSent(true);
    }

  return (
    <>
        <TouchableOpacity style={styles.button} onPress={handleOpen}>
            <ChatTeardropDots 
                size={24}
                weight={'bold'}
                color={theme.colors.text_on_brand_color}
            />
        </TouchableOpacity>
        <BottomSheet 
            ref={bottomSheetRef} 
            snapPoints={[1,280]}
            backgroundStyle={styles.modal}
            handleIndicatorStyle={styles.indicator}
        >
            {
                feedbackSent ? 
                <Sucess onSendAnotherFeedback={handleRestarFeedback}/> : 
                <>
                   { feedbackType ?
                    <Form 
                        feedbackType={feedbackType} 
                        onFeedbackCanceled={handleRestarFeedback}
                        onFeedbackSent={handleFeedbackSent}
                    />
                    :
                    <Options 
                        onFeedbackTypeChanged={setFeedbackType}
                    />}
                </>
            }
        </BottomSheet>
    </>
  );
}

export default gestureHandlerRootHOC(Widget);