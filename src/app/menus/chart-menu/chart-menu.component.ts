import {Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation, Output, EventEmitter} from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import {CityIOService} from '../../services/cityio.service';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material';
import { preserveWhitespacesDefault } from '@angular/compiler';


@Component({
    selector: 'app-chart-menu',
    templateUrl: './chart-menu.component.html',
    styleUrls: ['./chart-menu.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ChartMenuComponent implements OnInit, OnChanges {

    constructor(private cityIoService: CityIOService) {
    }

    @ViewChild('chart', {static: true})
    chartContainer: ElementRef;
    @Input() chartToShow: string;
    private data: Array<any>;
    private gfaData: Array<any>;
    private stormwaterData: Array<any>;
    private margin: any = {top: 20, bottom: 20, left: 20, right: 20};
    private chart: any;
    private width: number;
    private height: number;
    private svg: any;
    private isLoading = false;
    private chartHasTargets = false;
    private colorArray = [
        '#f5f5f5', // first color repeats since for stacked bars the first bar ("total") is underneath the others
        '#f5f5f5',
        '#f48fb1',
        '#ec407a',
        '#d81b60',
        '#ad1457'
    ];


    ngOnChanges() {
        this.updateChart();
    }

    ngOnInit() {
        // placeholder results
        this.gfaData = [
            {'gfa': 'Other', 'value': 0, 'target': 30000},
            {'gfa': 'Commercial', 'value': 0, 'target': 550000},
            {'gfa': 'Residential', 'value': 0, 'target': 300000}
        ];
        this.stormwaterData = [
            {'stormwater': 'white', 'value': 0},
            {'stormwater': 'grey', 'value': 0},
        ];

        this.getDataFromCityIO();
        this.cityIoService.gridChangeListener.push(this.updateFromCityIO.bind(this));
        this.createChart();
        this.updateChart();
    }

    async updateFromCityIO(field) {
        if (this.cityIoService.checkHashes(false).indexOf(this.chartToShow) >= 0) {
            // kpi_gfa is not up to date
            this.isLoading = true;
        }
        if (field === this.chartToShow) {
            // got new data
            this.getDataFromCityIO();
            this.updateChart();
            this.isLoading = false;
        }
    }

    getDataFromCityIO() {
        let cityIoGFA = this.cityIoService.table_data['kpi_gfa'];
        if (cityIoGFA) {
            this.gfaData = [
                {
                    'subresult': 'Other',
                    'target': cityIoGFA['special_expected'],
                    value: {
                        Total: cityIoGFA['special']
                    },
                },
                {
                    'subresult': 'Commercial',
                    'target': cityIoGFA['commerce_expected'],
                    value: {
                        Total: cityIoGFA['commerce']
                    },
                },
                {
                    'subresult': 'Residential',
                    'target': cityIoGFA['living_expected'],
                    value: {
                        Total: cityIoGFA['living']
                    },
                }
            ];
        }
        let cityIoStormwater = this.cityIoService.table_data['stormwater'];
        if (cityIoStormwater) {
            // this.stormwaterData = [
            //     {'subresult': 'Street/Promenade', value: cityIoStormwater['street_total']},
            //     {'subresult': 'Buildings', value: cityIoStormwater['building_total']},
            //     {'subresult': 'Open space', value: cityIoStormwater['open_total']}
            // ];
            this.stormwaterData = [
                {subresult: 'Street/Promenade', value: {
                    Total: cityIoStormwater['street_total'],
                    Promenade: cityIoStormwater['promenade'],
                    Street: cityIoStormwater['street']
                }},
                {subresult: 'Buildings', value: {
                    Total: cityIoStormwater['building_total']
                }},
                {subresult: 'Open space', value: {
                    Total: cityIoStormwater['open_total'],
                    Plaza: cityIoStormwater['open_space/promenade'],
                    'Green Space': cityIoStormwater['open_space/green_space'],
                    'Athletic Field': cityIoStormwater['open_space/athletic_field']
                }},
            ];

        }
        // return cityIoGFA;
    }

    createChart() {
        let element = this.chartContainer.nativeElement;
        this.width = 300 - this.margin.left - this.margin.right;
        this.height = 200 - this.margin.top - this.margin.bottom;

        this.svg = d3.select(element).append('svg')
            .attr('height', element.offsetHeight);
    }

    updateChart() {
        this.setDetailsForChart();
        d3.selectAll('svg > *').remove();
        d3.selectAll('.d3-tip').remove();

        if (this.svg) {
            let offsetLeft = 0;

            // chart plot value
            this.chart = this.svg.append('g')
                .attr('class', 'bars')
                .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

            const y = d3.scaleBand()
                .range([this.height, 0])
                .padding(0.1)
                .domain(this.data.map((d) => {
                    return d.subresult;
                }));

            const x = d3.scaleLinear()
                .range([0, this.width])
                .domain([0, d3.max(this.data, (d) => {
                    const _max = d3.max(Object.values(d.value));

                    if (!d.target) {
                        return _max;
                    }
                    return _max > d.target ? _max : d.target;
                })]);

            // add the x Axis
            const xAxis = this.svg.append('g')
                .attr('class', 'axis axis-x')
                .attr('transform', 'translate(' + this.margin.left + ',' + this.height + ')')
                .call(d3.axisBottom(x));

            // add the y Axis
            const yAxis = this.svg.append('g')
                .attr('class', 'axis axis-y')
                .call(d3.axisLeft(y));

            // translate y-Axes according to label width
            yAxis.selectAll('.tick')
                .selectAll('text')
                .call((s) => {
                    s.nodes().forEach(tick => {
                        const tickWidth = tick.getBoundingClientRect().width;

                        offsetLeft = tickWidth > offsetLeft ? tickWidth : offsetLeft;
                    });
                });

            yAxis.attr('transform', 'translate(' + (this.margin.left + offsetLeft) + ',0)');

            // Adjust the svg total width
            this.svg.attr('width', this.width + this.margin.left + this.margin.right + offsetLeft);

            // Tooltip for chart
            const tip = d3Tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html((d) => {
                    let text = `<strong>${d[0]}: </strong> <span style=\'color:black\'>${d[1]}</span> <br />`;

                    // Add total value for comparison, if stacked chart
                    if (d[0] !== 'Total') {
                        text += '<strong>Total: </strong> <span style=\'color:black\'>' + d[2] + '</span> <br />';
                    }

                    // Add target value for comparison if exists
                    if (this.chartHasTargets) {
                        text = text + '<strong>Target: </strong> <span style=\'color:red\'>' + d[3] + '</span>';
                    }

                    return text;
                });

            this.svg.call(tip);

            // append the rectangles for the bar chart
            let eSel = this.svg.selectAll('.bar')
                .data(this.data)
                .enter();

            eSel.append('g')
                .attr('transform', (d) => `translate(${this.margin.left + offsetLeft + 3}, ${y(d.subresult)})`)
                .attr('opacity', '0.8')
                .selectAll('rect')
                .data(d => Object.entries(d.value).map(val => {
                    // add total and target value to the entries array for comparison in tooltip
                    val.push(d.value.Total);
                    if (d.target) {
                        val.push(d.target);
                    }
                    return val;
                }))
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('width', (d) => x(d[1]))
                .attr('height', y.bandwidth())
                .attr('x', (d, i, n) => {
                    if (i > 1) {
                        return parseFloat(n[i - 1].getAttribute('width')) + parseFloat(n[i - 1].getAttribute('x'));
                    }
                    return 0;
                })
                .attr('fill', function(d, i) {
                    return this.getBarColor(d, i);
                }.bind(this))
                .on('mouseover', function(d) {
                    tip.show(d, this);
                })
                .on('mouseout', d => tip.hide(d));

            if (this.chartHasTargets) {
                // add the target lines
                eSel.append('path')
                    .style('stroke-width', 1)
                    .style('stroke', this.colorArray[3])
                    .attr('d', function(d) {
                        const marginLeft = this.margin.left + offsetLeft + 3;
                        let rv = 'M' + (x(d.target) + marginLeft) + ',' + y(d.subresult);
                        rv += 'L' + (x(d.target) + marginLeft) + ',' + (y(d.subresult) + y.bandwidth());
                        return rv;
                    }.bind(this));
            }
        }
    }

    private getBarColor(d, i) {
        return this.colorArray[i];
    }

    private setDetailsForChart() {
        if (this.chartToShow === 'kpi_gfa') {
            this.data = this.gfaData;
            this.chartHasTargets = true;
            return;
        }
        if (this.chartToShow === 'stormwater') {
            this.data = this.stormwaterData;
            this.chartHasTargets = false;
            return;
        }
        console.warn('unknown chart requested:', this.chartToShow);
    }
}
