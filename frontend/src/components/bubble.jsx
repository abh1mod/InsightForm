import Highcharts from 'highcharts';
import {useRef, useEffect} from 'react';
// Alternatively, this is how to load Highcharts Stock. The Maps and Gantt
// packages are similar.
// import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';

import 'highcharts/modules/exporting';

const Bubble = (props) => {
    // useRef to get a reference to the DOM element where the chart will be rendered
    const chartContainerRef = useRef(null);

    useEffect(() => {
        // Highcharts configuration object
        const options = {
            chart: {
                type: 'packedbubble',
            },
            title: {
                text: props.title,
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value}',
            },
            plotOptions: {
                packedbubble: {
                    colorByPoint: true,
                    minSize: '60%',
                    maxSize: '150%',
                    layoutAlgorithm: {
                        splitSeries: false,
                        parentNodeLimit: true,
                        gravitationalConstant: 0.0001,
                    },
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}',
                        style: {
                            color: 'black',
                            textOutline: 'none',
                            fontWeight: 'normal',
                        },
                    },
                },
            },
            series: [{
                data: props.data
            }],
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            }
        };

        // Create the chart instance
        const chart = Highcharts.chart(chartContainerRef.current, options);
        const timeoutId = setTimeout(() => {
            chart.reflow();
        }, 0);
        
        // Cleanup function
        return () => {
            clearTimeout(timeoutId); // Clear the timeout
            chart.destroy();
        };
            
    }, []); // The effect's dependency array

    return (
        // The div that Highcharts will use to render the chart
        <div ref={chartContainerRef} className='w-full h-full'> </div>
    );
};

export default Bubble;
