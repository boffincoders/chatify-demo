import Chart from "react-apexcharts"
const BarChart = ({ chartOptions, chartData }: any) => {

    return (
        <Chart
            options={chartOptions}
            series={chartData}
            type="bar"
            width="100%"
            height="100%"
        />
    )
}

export default BarChart