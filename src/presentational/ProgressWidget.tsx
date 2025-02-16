import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ProgressChart} from 'react-native-chart-kit';
import {standardPadding} from 'src/styles';
import {Text, useTheme} from '@ui-kitten/components';

type PropTypes = {
  title: string;
  detail: string;
  data: number[];
};

function ProgressChartWidget(props: PropTypes) {
  const theme = useTheme();
  const {title, detail, data} = props;

  return (
    <View>
      <Text category="c1" numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.chartContainer}>
        <Text
          category="c1"
          style={[
            StyleSheet.absoluteFillObject,
            {zIndex: 1, left: '39%', top: '42%'},
          ]}>
          {detail}
        </Text>
        <ProgressChart
          data={data}
          width={100}
          height={100}
          strokeWidth={12}
          radius={44}
          chartConfig={{
            backgroundGradientFromOpacity: 0.5,
            backgroundGradientFrom: theme['background-basic-color-1'],
            backgroundGradientTo: theme['background-basic-color-1'],
            backgroundGradientToOpacity: 1,
            color: (opacity = 1) => `rgba(27, 197, 117, ${opacity})`,
            strokeWidth: 2, // optional, default 3
            barPercentage: 0.5,
            useShadowColorFromDataset: false, // optional
          }}
          hideLegend
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: standardPadding * 2,
  },
});

export default ProgressChartWidget;
