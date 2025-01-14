import { Component, OnInit } from '@angular/core';
import {DatePipe} from '@angular/common';
import {SocketioService} from '../../services/socketio.service';
import {CrudService} from '../../services/crud.service';
import {API_URL, RESOURCE} from '../../globals/global_variables';
import * as math from 'mathjs';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss'],
  providers: [DatePipe]
})
export class ResourceComponent implements OnInit {

  private firstLoad: boolean = true;
  private cpus = [];
  private mems = [];
  private netI = [];
  private netO = [];
  public cpuSum = [0, 0, 0, 0, 0];
  public memSum = [0, 0, 0, 0, 0];
  public netOSum = [0, 0, 0, 0, 0];
  public netISum = [0, 0, 0, 0, 0];
  private cpusPerContainer = [];
  private memPerContainer = [];
  private netIperContainer = [];
  private netOperContainer = [];
  private labels = [];
  public metrics: any;
  public backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
  ];
  public borderColor = [
    'rgba(255,99,132,1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ]
  public cpuPerNodeData = [{
    label: "CPU %",
    data: [],
    borderWidth: 1,
    borderColor: this.borderColor[0],
    backgroundColor: this.backgroundColor[0],
    fill: false
  }];
  public memPerNodeData = [];
  public netInPerNodeData = [];
  public netOuPerNodeData = [];

  cpuData = [{
    label: 'Average CPU %',
    data: this.cpus,
    borderWidth: 1,
    fill: false
  }];
  memData = [{
    label: 'Average MEM %',
    data: this.mems,
    borderWidth: 1,
    fill: false
  }];

  netInData = [{
    label: 'Average Net Input (B)',
    data: this.netI,
    borderWidth: 1,
    fill: false
  }];
  netOuData = [{
    label: 'Average Net output (B)',
    data: this.netO,
    borderWidth: 1,
    fill: false
  }];



  lineChartLabels = this.labels;

  lineChartOptions = {

    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString:  'Time',
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true
        },
        ticks: {
          beginAtZero: true,
          suggestedMax: 100,
        }
      }]
    },
    legend: {
      display: true
    },
    elements: {
      point: {
        radius: 0
      }
    }
  };

  lineChartColors = [
    {
      borderColor: 'rgba(255,99,132,1)'
    }
  ];

  barChartData = [{
    label: '# of Votes',
    data: [10, 19, 3, 5, 2, 3],
    borderWidth: 1,
    fill: false
  }];

  barChartLabels = ["2013", "2014", "2014", "2015", "2016", "2017"];

  barChartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,

        }
      }]
    },
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 0
      }
    }
  };

  barChartColors = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ]
    }
  ];

  areaChartData = [{
    label: '# of Votes',
    data: [10, 19, 3, 5, 2, 3],
    borderWidth: 1,
    fill: true
  }];

  areaChartLabels = ["2013", "2014", "2014", "2015", "2016", "2017"];

  areaChartOptions = {};

  areaChartColors = [
    {
      borderColor: 'rgba(255,99,132,1)',
      backgroundColor: 'rgba(255,99,132,.2)'
    }
  ];


  doughnutPieChartData = [
    {
      data: [30, 40, 30],
    }
  ];

  doughnutPieChartLabels = ["Pink", "Blue", "Yellow"];

  doughnutPieChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  doughnutPieChartColors = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
      ]
    }
  ];


  scatterChartData = [
    {
      label: 'First Dataset',
      data: [{
        x: -10,
        y: 0
      },
        {
          x: 0,
          y: 3
        },
        {
          x: -25,
          y: 5
        },
        {
          x: 40,
          y: 5
        }
      ],
      borderWidth: 1
    },
    {
      label: 'Second Dataset',
      data: [{
        x: 10,
        y: 5
      },
        {
          x: 20,
          y: -30
        },
        {
          x: -25,
          y: 15
        },
        {
          x: -10,
          y: 5
        }
      ],
      borderWidth: 1
    }
  ];

  scatterChartOptions = {
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom'
      }]
    }
  };

  scatterChartColors = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)'      ]
    },
    {
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)'
      ]
    }
  ];



  constructor(
    private socketioService: SocketioService,
    private datePipe: DatePipe,
    private crudService: CrudService,
  ) { }

  setCpuPerNodeData() {

    var i = 0;
    if(this.firstLoad){
      this.cpuPerNodeData.pop()
    }

    for (let name in this.cpusPerContainer) {

      this.cpuPerNodeData.push({
        data: this.cpusPerContainer[name],
        label: name,
        borderWidth: 1,
        borderColor: this.borderColor[i],
        backgroundColor: this.backgroundColor[i],
        fill: false
      })
      i++;
    }
    this.cpuPerNodeData.push({
       data: this.cpus,
        label: 'Average ',
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'black',
        fill: false
      })



  }

  setMemPerNodeData() {
    var i = 0;
    if(this.firstLoad){
      this.memPerNodeData.pop()
    }
    for (let name in this.memPerContainer) {

      this.memPerNodeData.push({
        data: this.memPerContainer[name],
        label: name,
        borderWidth: 1,
        borderColor: this.borderColor[i],
        backgroundColor: this.backgroundColor[i],
        fill: false
      })
      i++;
    }


     this.memPerNodeData.push({
        data: this.mems,
        label: 'Average',
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'black',
        fill: false
      })

  }

  setNetInPerNodeData() {
    var i = 0;
    if(this.firstLoad){
      this.netInPerNodeData.pop()
    }
    for (let name in this.netIperContainer) {

      this.netInPerNodeData.push({
        data: this.netIperContainer[name],
        label: name,
        borderWidth: 1,
        borderColor: this.borderColor[i],
        backgroundColor: this.backgroundColor[i],
        fill: false
      })
      i++;
    }

    this.netInPerNodeData.push({
         label: 'Average',
         data: this.netI,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'black',
        fill: false
      })

  }

  setNetOuPerNodeData() {
    var i = 0;
    if(this.firstLoad){
      this.netOuPerNodeData.pop()
    }
    for (let name in this.netOperContainer) {

      this.netOuPerNodeData.push({
        data: this.netOperContainer[name],
        label: name,
        borderWidth: 1,
        borderColor: this.borderColor[i],
        backgroundColor: this.backgroundColor[i],
        fill: false
      })
      i++;
    }

     this.netOuPerNodeData.push({
         label: 'Average',
         data: this.netO,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'black',
        fill: false
      })

  }

  splitData(data) {
    this.labels.push(this.datePipe.transform(data.time, 'hh:mm:ss'))
    this.cpus.push(data.avgCPU)
    this.mems.push(data.avgMEM)
    this.netI.push(data.avgNetI)
    this.netO.push(data.avgNetO)
    if (data.containers){
      data.containers.forEach(
        x => {
          if (!this.cpusPerContainer[x.name]) {
            this.cpusPerContainer[x.name] = []
            this.memPerContainer[x.name] = []
            this.netIperContainer[x.name] = []
            this.netOperContainer[x.name] = []
          }
          this.cpusPerContainer[x.name].push(x.cpu)
          this.memPerContainer[x.name].push(x.mem)
          this.netIperContainer[x.name].push(x.netI)
          this.netOperContainer[x.name].push(x.netO)
        }
      )
    }
    this.calculateSummary()
  }

  calculateSummary() {
    this.cpuSum[0] = math.mean(this.cpus)
    this.cpuSum[1] = math.variance(this.cpus)
    this.cpuSum[2] = math.std(this.cpus)
    this.cpuSum[3] = math.min(this.cpus)
    this.cpuSum[4] = math.max(this.cpus)

    this.memSum[0] = math.mean(this.mems)
    this.memSum[1] = math.variance(this.mems)
    this.memSum[2] = math.std(this.mems)
    this.memSum[3] = math.min(this.mems)
    this.memSum[4] = math.max(this.mems)

    this.netISum[0] = math.mean(this.netI)
    this.netISum[1] = math.variance(this.netI)
    this.netISum[2] = math.std(this.netI)
    this.netISum[3] = math.min(this.netI)
    this.netISum[4] = math.max(this.netI)

    this.netOSum[0] = math.mean(this.netO)
    this.netOSum[1] = math.variance(this.netO)
    this.netOSum[2] = math.std(this.netO)
    this.netOSum[3] = math.min(this.netO)
    this.netOSum[4] = math.max(this.netO)

  }

  getResourceMetrics() {
    this.crudService.getAll(API_URL + RESOURCE).subscribe(
      (response) => {
        console.log(response)
        this.metrics = response.data
        this.metrics.forEach(
          x => {
            this.splitData(x)
          })
        this.setCpuPerNodeData()
        this.setMemPerNodeData()
        this.setNetInPerNodeData()
        this.setNetOuPerNodeData()
        this.firstLoad = false
        this.calculateSummary()
      });
  }

  ngOnInit() {
    this.getResourceMetrics()

    this.socketioService.getSocketInstance().on('resource', (metric) => {
      this.splitData(metric)

    });

  }

}
