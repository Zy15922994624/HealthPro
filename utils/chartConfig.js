// 图表基础配置
export const baseChartOpts = {
    type: 'line',
    padding: [15, 10, 0, 15],
    legend: { show: true },
    xAxis: { type: 'category', boundaryGap: false },
    yAxis: {
        type: 'value',
        splitLine: { show: true, lineStyle: { color: '#eee' } }
    },
    extra: {
        line: {
            type: 'straight',
            width: 2
        }
    },
    dataLabel: false,
    height: 280,
    animation: false
}

// 各个趋势图表的特定配置
export const chartConfigs = {
    health: {
        ...baseChartOpts,
        extra: {
            line: {
                type: 'straight',
                width: 2,
                color: '#1aa7e3'
            }
        }
    },
    sport: {
        ...baseChartOpts,
        extra: {
            line: {
                type: 'straight',
                width: 2,
                color: '#07c160'
            }
        }
    },
    diet: {
        ...baseChartOpts,
        extra: {
            line: {
                type: 'straight',
                width: 2,
                color: '#ff9c19'
            }
        }
    }
}