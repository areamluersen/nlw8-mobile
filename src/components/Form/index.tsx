import { ArrowLeft } from 'phosphor-react-native';
import React from 'react';
import { 
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity

} from 'react-native';

import {FeedbackType} from '../Widget';
import { theme } from '../../theme';

import { styles } from './styles';
import { feedbackTypes } from '../../utils/feedbackTypes';
import { ScreenshotButton } from '../ScreenshotButton';
import { Button } from '../Button';
import { captureScreen } from 'react-native-view-shot';
import { api } from '../../libs/api';
import * as FileSystem from 'expo-file-system';

interface Props {
  feedbackType: FeedbackType
  onFeedbackCanceled: () => void
  onFeedbackSent: () => void
}

export function Form({feedbackType, onFeedbackCanceled, onFeedbackSent}: Props) {
  const [screenshot, setScreenshot] = React.useState<string | null>(null);
  const [isSendingFeedback, setIsSendingFeedback] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const feedbackTypeInfo = feedbackTypes[feedbackType]

  function handleScreenshot() {
    captureScreen({format: 'jpg', quality: 0.8}).then(uri => setScreenshot(uri))
    .catch(error => console.log(error));
  }

  function handleScreenshotRemove() {
    setScreenshot(null);
  }

  async function handleSendFeedback() {
    if(isSendingFeedback) return;
    setIsSendingFeedback(true);
    const screenshotbase64 = screenshot && await FileSystem.readAsStringAsync(screenshot, {encoding: 'base64'});	

    try {
      await api.post('/feedbacks', {
        type: feedbackType,
        screenshot: `data:image/png;base64, ${screenshotbase64}`,
        comment: comment
      })

      onFeedbackSent();
    }catch(error){
      console.log(error);
      setIsSendingFeedback(false);
    }
  } 


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft 
            size={24}
            weight='bold'
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image 
            source={feedbackTypeInfo.image}
            style={styles.image}
          />
          <Text style={styles.titleText}> 
            {feedbackTypeInfo.title}
          </Text>
        </View>
      </View>
      
      <TextInput
        multiline
        style={styles.input}
        placeholder='Describe your issue here...'
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        onChangeText={setComment}
      />
      <View style={styles.footer}>
        <ScreenshotButton 
          onTakeScreenshot={handleScreenshot} 
          onRemoveScreenshot={handleScreenshotRemove} 
          screenshot={screenshot}
        />
        <Button onPress={handleSendFeedback} isLoading={isSendingFeedback} />
      </View>

    </View>
  );
}