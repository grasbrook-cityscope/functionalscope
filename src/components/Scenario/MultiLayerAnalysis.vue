<script>

import { mapState } from 'vuex'
import { generateStoreGetterSetter } from '@/store/utils/generators.ts'
import { noiseSettingsNames } from '@/store/noise'
import {filterAndScaleLayerData, showMultiLayerAnalysis} from "@/store/scenario/multiLayerAnalysis";
import SubSelectionLayerConfig from "@/config/layerSubSelection.json";
import mdiInformationPng from '@/assets/mdi-information.png';
import CombinedLayersConfig from  "@/config/multiLayerAnalysis.json";
import PerformanceInfoLayerConfig from  "@/config/performanceInfos.json";

export default {
    name: 'MultiLayerAnalysis',
    components: {},
    data () {
        return {
          activeDivision: null,
          componentDivisions: [],
          showError: false,
          missingInputScenarios: [],
          showMissingScenarios: false,
          layersReadyToCompare: [],
          layerChoice_1: null,
          layerChoice_2: null,
          criteriaChoice_1: null,
          criteriaChoice_2: null,
          sliderValues_1: [],
          sliderValues_2: [],
          criteriaLayer_1: null,
          criteriaLayer_2: null,
          enableCriteriaLayer_1: false,
          enableCriteriaLayer_2: false,
          emptyDataWarning: false,
          resultOutdated: false,
          allResultCriteria: [
            // TODO adjust ranges for amenity stats!??
            // add corresponding result file source in multiLayerAnalysis.ts  -> layerLookup()
            {
              "layerName": "Noise",
              "label": "Traffic Noise",
              "value": "noise",
              "unit": "dB",
              "range": [45, 80],
              "step": 5
            },
            {
              "layerName": "Abm",
              "label": "Pedestrian Density",
              "value": "pedestrianDensity",
              "unit": "pedestrians/m²",
              "range": [0, 0.3],
              "step": 0.01
            },
            {
              "layerName": "Abm",
              "label": "Amenity Types",
              "value": "Amenity Types",
              "unit": "unique place types",
              "range": [0, 20],
              "step": 1
            },
            {
              "layerName": "Abm",
              "label": "Amenity Density",
              "value": "Density",
              "unit": "places/km²",
              "range": [0, 850],
              "step": 1
            },
            {
              "layerName": "Wind",
              "label": "Wind Speed",
              "value": "wind",
              "unit": "Lawson Criteria",
              "range": [0, 1],
              "step": 0.2
            },
            {
              "layerName": "Sun",
              "label": "Sun Exposure",
              "value": "sun",
              "unit": "h/day",
              "range": [0, 1],
              "step": 0.1
            },
          ],
          availableResultCriteria: [],
          criteriaOptions_1: [],
          criteriaOptions_2: [],
          presetOptions: {
            "Custom": [0,100],
            "Very Low": [0,10],
            "Low": [0,33],
            "Medium": [33,66],
            "High": [66,100],
            "Very High": [90,100]
          },
          preset_1: "High",
          preset_2: "High",
          logicOptions: [
              {"label": "AND", "value": "and"},
              {"label": "AND NOT", "value": "and_not"},
            ],
          logicOperator: null,
          resultLookups: {},
          allSimulationResults: null,
          combinedLayers: null
        }
    },
  computed: {
      ...mapState('scenario', ['resultLoading']), // getter only
      // syntax for storeGetterSetter [variableName, get path, ? optional custom commit path]
      ...generateStoreGetterSetter([
      ['activeMenuComponent', 'activeMenuComponent'],
      ['visibleLayers', 'visibleLayers'],
      ['noiseScenario', 'scenario/noiseScenario'],
      ['currentWindScenario', 'scenario/currentWindScenario'],
      ['windScenarioHash', 'scenario/windScenarioHash'],
      ['abmSettings', 'scenario/moduleSettings'],
    ]),
    currentAbmResult(){
      return this.$store.state.scenario.activeAbmSet;
    },
    abmStatsMultiLayerAnalysis() {
      return this.$store.state.scenario.abmStatsMultiLayer;
    },
    currentNoiseResult(){
      return this.$store.state.scenario.currentNoiseGeoJson;
    },
    currentWindResult(){
      return this.$store.state.scenario.windResultGeoJson;
    },
    currentSunResult(){
      return this.$store.state.scenario.sunExposureGeoJson;
    },
    },
    watch: {
      layerChoice_1(newVal, oldVal) {
        // update options for selectable indexes (to be combined to new layer)
        this.criteriaOptions_1 = this.availableResultCriteria.filter(option => {
          return option.layerName === this.layerChoice_1
        })
        this.criteriaChoice_1 = this.criteriaOptions_1[0]
        this.sliderValues_1 = this.criteriaChoice_1.range
      },
      layerChoice_2(newVal, oldVal) {
        this.criteriaOptions_2 = this.availableResultCriteria.filter(option => {
          return option.layerName === this.layerChoice_2
        })
        this.criteriaChoice_2 = this.criteriaOptions_2[0]
        this.sliderValues_2 = this.criteriaChoice_2.range
      },
      criteriaChoice_1: {
        deep: true,
        handler() {
          if (this.criteriaChoice_1.label === this.criteriaChoice_2.label) {
            this.showError = true
          } else {
            this.sliderValues_1 = this.getValueForPreset(this.preset_1, this.criteriaChoice_1.range)
            const request = {
              "layerName": this.criteriaChoice_1.value,
              "layerRange": this.criteriaChoice_1.range,
              "layerConstraints": this.sliderValues_1,
            }
            this.criteriaLayer_1 = filterAndScaleLayerData(request)
          }
        }
      },
      criteriaChoice_2: {
        deep: true,
        handler() {
          if (this.criteriaChoice_1.label === this.criteriaChoice_2.label) {
            this.showError = true
          } else {
            this.sliderValues_2 = this.getValueForPreset(this.preset_2, this.criteriaChoice_2.range)
            const request = {
              "layerName": this.criteriaChoice_2.value,
              "layerRange": this.criteriaChoice_2.range,
              "layerConstraints": this.sliderValues_2,
            }
            this.criteriaLayer_2 = filterAndScaleLayerData(request)
          }
        }
      },
      sliderValues_1: {
        deep: true,
        handler() {
          const request = {
            "layerName": this.criteriaChoice_1.value,
            "layerRange": this.criteriaChoice_1.range,
            "layerConstraints": this.sliderValues_1,
          }
          this.criteriaLayer_1 = filterAndScaleLayerData(request)
          this.emptyDataWarning = this.criteriaLayer_1.features.length === 0;
          if (this.enableCriteriaLayer_1) {
            this.$store.dispatch("scenario/addSubSelectionLayer", this.criteriaLayer_1.features)
          }
        }
      },
      sliderValues_2: {
        deep: true,
        handler() {
          const request = {
            "layerName": this.criteriaChoice_2.value,
            "layerRange": this.criteriaChoice_2.range,
            "layerConstraints": this.sliderValues_2,
          }
          this.criteriaLayer_2 = filterAndScaleLayerData(request)
          this.emptyDataWarning = this.criteriaLayer_2.features.length === 0;
          if (this.enableCriteriaLayer_2) {
            this.$store.dispatch("scenario/addSubSelectionLayer", this.criteriaLayer_2.features)
          }
        }
      },
      enableCriteriaLayer_1(showLayer, old) {
        if (showLayer) {
          if (this.enableCriteriaLayer_2) {
            this.enableCriteriaLayer_2 = false
          }
          this.$store.dispatch("scenario/addSubSelectionLayer", this.criteriaLayer_1.features)
          this.$store.dispatch("hideAllLayersButThese",[SubSelectionLayerConfig.layer.id])
        } else {
          // hide subSelectionLayer, if subSelection is not to be shown
          if (!this.enableCriteriaLayer_2) {
            this.$store.state.map?.setLayoutProperty(SubSelectionLayerConfig.layer.id, 'visibility', 'none');
            if (this.combinedLayers) {
              // show the combined layer if available
              this.$store.dispatch("hideAllLayersButThese", [
                CombinedLayersConfig.layer.id,
                PerformanceInfoLayerConfig.layer.id
              ])
            }
          }
        }
      },
      enableCriteriaLayer_2(showLayer, old) {
        if (showLayer) {
          if (this.enableCriteriaLayer_1) {
            this.enableCriteriaLayer_1 = false
          }
          this.$store.dispatch("scenario/addSubSelectionLayer", this.criteriaLayer_2.features)
          this.$store.dispatch("hideAllLayersButThese",[SubSelectionLayerConfig.layer.id])
        } else {
          // hide subSelectionLayer, if subSelection is not to be shown
          if (!this.enableCriteriaLayer_1) {
            this.$store.state.map?.setLayoutProperty(SubSelectionLayerConfig.layer.id, 'visibility', 'none');
            if (this.combinedLayers) {
              // show the combined layer if available
              this.$store.dispatch("hideAllLayersButThese", [
                CombinedLayersConfig.layer.id,
                PerformanceInfoLayerConfig.layer.id
              ])
            }
          }
        }
      },
      layersReadyToCompare: {
        deep: true,
        handler() {
          // check if at least to layers are available for analysis
          if (!(this.layersReadyToCompare.length >= 2)) {
            this.showMissingScenarios = true
            return
          }
          this.showMissingScenarios = false

          // filter layer options for actually available layers
          this.availableResultCriteria = this.allResultCriteria.filter(option => {
            return this.missingInputScenarios.indexOf(option.layerName) === -1
          })

          // set initial UI settings if not set yet
          if (!this.layerChoice_1) {
            this.layerChoice_1 = this.layersReadyToCompare[0]
            this.layerChoice_2 = this.layersReadyToCompare[1]
          }
        }
      },
      abmStatsMultiLayerAnalysis: {
        // update criteria layers , if abmStats change. They take a while to calculate,
        // so displayed data might be missing or outdated.
        deep: true,
        handler() {
          // check if at least to layers are available for analysis
          if (this.layerChoice_1 === "Abm") {
            const request = {
              "layerName": this.criteriaChoice_1.value,
              "layerRange": this.criteriaChoice_1.range,
              "layerConstraints": this.sliderValues_1,
            }
            this.criteriaLayer_1 = filterAndScaleLayerData(request)
          }
          if (this.layerChoice_2 === "Abm") {
            const request = {
              "layerName": this.criteriaChoice_2.value,
              "layerRange": this.criteriaChoice_2.range,
              "layerConstraints": this.sliderValues_2,
            }
            this.criteriaLayer_2 = filterAndScaleLayerData(request)
          }
        }
      }
    },
    async beforeMount() {
      this.addImageToMap()
      this.getResultsFromStore()
      this.determineMissingScenarios()
      this.updateLayerSelectionDropdowns()
    },
    mounted:
        function() {
          this.logicOperator = this.logicOptions[0]

          // calc input statistics, if all scenarios chosen
          if (this.currentAbmResult) {
            this.$store.dispatch('scenario/calculateStatsForMultiLayerAnalysis')
          }

          // hide all layers
          this.$store.dispatch('hideAllLayersButThese')

          /*autogenerationg Sub Menu for all divs of Class "division"*/
          var divisions = document.getElementsByClassName("division");
          for (var i = 0; i < divisions.length; i++) {
              let divInstance = {
                  title: divisions[i].getAttribute('data-title'),
                  pic: divisions[i].getAttribute('data-pic'),
              };
              this.componentDivisions.push(divInstance);
          }

          this.activeDivision = divisions[0].getAttribute('data-title');
          console.log("active divisoin is", this.activeDivision)
        },
    methods: {
      addImageToMap() {
        // add image to map if necessary . For result annotation layer.
        if (!$store.state.map.hasImage("mdi-information")) {
          const map = this.$store.state.map
          map.loadImage(
            mdiInformationPng,
            function (error, image) {
              if (error) throw error;
              map.addImage('mdi-information', image);
            }
          )
        }
      },
      getResultsFromStore() {
        this.allSimulationResults = {
          "Noise": this.currentNoiseResult,
          "Abm": this.currentAbmResult,
          "Wind": this.currentWindResult,
          "Sun": this.currentSunResult
        }
      },
      determineMissingScenarios() {
        // iterate over scenario results, if a result is empty add the topic to missing Input scenarios
        this.getResultsFromStore()
        this.missingInputScenarios = []
        this.layersReadyToCompare = []
        for (const [key, value] of Object.entries(this.allSimulationResults)) {
          if (!value) {
            this.missingInputScenarios.push(key)
          } else {
            this.layersReadyToCompare.push(key)
          }
        }
      },
      async loadDefaultResultFor(layerName) {
        switch (layerName) {
          case "Sun":
            await this.$store.dispatch('scenario/addSunExposureLayer')
            break;
          case "Wind":
            this.windScenarioHash = "158d2b824886d908440da5c5f6c4dc4f815cdeba"
            this.currentWindScenario = { "wind_speed": 5, "wind_direction": 270 }
            await this.$store.dispatch('scenario/updateWindLayer')
            break;
          case "Noise":
            await this.$store.dispatch('scenario/updateNoiseScenario')
            break;
          case "Abm":
            await this.$store.dispatch('scenario/updateAbmDesignScenario')
            this.$store.dispatch('hideAllLayersButThese')
            this.$store.dispatch('scenario/calculateStatsForMultiLayerAnalysis').then(() => {
              console.log("stats calc ready")
              this.updateAbmCriteriaLayer()
            })
            break;
          default:
            console.error("cannot load default result for unknown layer", layerName)
            this.updateLayerSelectionDropdowns()
        }
        // then update missing scenarios and hide result layers
        this.determineMissingScenarios()
        //this.updateLayerSelectionDropdowns()
        this.$store.dispatch('hideAllLayersButThese')
      },
      updateAbmCriteriaLayer() {
        // check if at least to layers are available for analysis
        if (this.layerChoice_1 === "Abm") {
          const request = {
            "layerName": this.criteriaChoice_1.value,
            "layerRange": this.criteriaChoice_1.range,
            "layerConstraints": this.sliderValues_1,
          }
          this.criteriaLayer_1 = filterAndScaleLayerData(request)
        }
        if (this.layerChoice_2 === "Abm") {
          const request = {
            "layerName": this.criteriaChoice_2.value,
            "layerRange": this.criteriaChoice_2.range,
            "layerConstraints": this.sliderValues_2,
          }
          this.criteriaLayer_2 = filterAndScaleLayerData(request)
        }
      },
      updateLayerSelectionDropdowns() {
        // check if at least to layers are available for analysis
        if (!(this.layersReadyToCompare.length >= 2)) {
          return
        }

        // filter layer options for actually available layers
        this.availableResultCriteria = this.allResultCriteria.filter(option => {
          return this.missingInputScenarios.indexOf(option.layerName) === -1
        })

        // set initial UI settings if not set yet
        if (!this.layerChoice_1) {
          // layer Selection
          this.layerChoice_1 = this.layersReadyToCompare[0]
          this.layerChoice_2 = this.layersReadyToCompare[1]
          this.enableCriteriaLayer_1 = true
        }
      },
      inputChanged() {
        if (this.combinedLayers) {
          this.resultOutdated = true;
        }

        this.showError = false;
      },
      getValueForPreset(presetChoice, range) {
        const minPercent = this.presetOptions[presetChoice][0] / 100
        const maxPercent = this.presetOptions[presetChoice][1] / 100
        const maxValue = range[1]

        return [maxValue * minPercent, maxValue * maxPercent]
      },
      getScenarioDescriptionFor(layerName) {
        switch (layerName) {
          case "Sun":
            return "DEFAULT SCENARIO"
          case "Wind":
            return "DIRECTION: " + this.currentWindScenario["wind_direction"] +
              " | " + "SPEED: " +  this.currentWindScenario["wind_speed"] + "km/h"
          case "Noise":
            return "VOLUME: " + this.noiseScenario["traffic_percent"] * 100 + "%"
              + " | " + "SPEED: " +  this.noiseScenario["max_speed"] + "km/h"
          case "Abm":
            return "Scenario 1"

          default:
            console.error("cannot create description for unknown layer", layerName)
        }
      },
      async showCombinedLayers() {
        this.$store.commit('scenario/resultLoading', true)
        this.$store.commit("scenario/loader", true);
        this.$store.commit("scenario/loaderTxt", "Combining Layers");

        // disable editing of layer criteria
        this.enableCriteriaLayer_1 = this.enableCriteriaLayer_2 = false;
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!this.combinedLayers || this.resultOutdated) {
          // recombine layers if input options have changed
          this.resultOutdated = false
          this.combinedLayers = await showMultiLayerAnalysis(
            this.criteriaLayer_1,
            this.criteriaLayer_2,
            this.logicOperator.value
          )
        }

        if (!this.combinedLayers || this.combinedLayers.length === 0) {
          this.emptyDataWarning = true
        } else {
          this.$store.commit("scenario/multiLayerAnalysisMap", true);
        }

        this.$store.commit('scenario/resultLoading', false)
        this.$store.commit("scenario/loader", false);
        this.$store.dispatch("hideAllLayersButThese", [
          CombinedLayersConfig.layer.id,
          PerformanceInfoLayerConfig.layer.id
        ])
      }
    }
}


</script>

<template>
  <div id="scenario" ref="scenario">
    <div class="component_divisions">
      <ul>
        <!-- This will create a menu item from each div of class "division" (scroll down for example) -->
        <li v-for="division in componentDivisions" :key="division.title" v-bind:class="{ highlight: activeDivision === division.title }">
          <div class="component_link" @click="activeDivision = division.title">
            <v-icon>{{division.pic}}</v-icon>
          </div>
          <div class="toHover">{{division.title}}</div>
        </li>
      </ul>
    </div>

    <!--each div element needs data-title and data-pic for autocreating menu buttons-->
    <!--icon code is selected for material icons ... look up https://materialdesignicons.com/cdn/2.0.46/ for possible icons-->
    <div class="division" data-title='Scenario' data-pic='mdi-map-marker-radius'>
      <!--v-if needs to be set to data-title to make switch between divisions possible-->
      <div v-if="activeDivision === 'Scenario'" class="component_content scenario">
       <v-container fluid>
        <div class="scenario_box" :class="resultOutdated ? 'highlight' : ''">
        <!-- Choose Layers to combine -->
          <header class="text-sm-left">LAYER SELECTION</header>
          <!-- per row: check button. AND/OR selector. slider per v-select -->
          <!-- set slider min max dynamically -->
          <div v-if="layersReadyToCompare.length >= 2">
            <v-row align="center" class="mb-0">
                <v-select
                  :items="layersReadyToCompare"
                  v-model="layerChoice_1"
                  @change="inputChanged()"
                  item-text="label"
                  item-value="label"
                  solo
                  persistent-hint
                  return-object
                  single-line
                  dark
                  hide-details
                ></v-select>
            </v-row>
            <v-row>
                <v-select
                  :items="layersReadyToCompare"
                  v-model="layerChoice_2"
                  @change="inputChanged()"
                  item-text="label"
                  item-value="label"
                  solo
                  persistent-hint
                  return-object
                  single-line
                  dark
                  hide-details
                ></v-select>
            </v-row>
          </div>
          <!-- Layers not available?? Load defaults! -->
          <div v-if="missingInputScenarios.length">
            <v-row class="mb-0" align="start">
              <v-col cols="10">
                <v-card
                  class="pa-0"
                  tile
                  dark
                  style="background-color: transparent;"
                >
                  <header class="text-sm-left">Layer Not Available?</header>
                </v-card>
              </v-col>
              <v-col cols="2">
                  <v-icon v-if="!showMissingScenarios" size="10" color="white" @click="showMissingScenarios = !showMissingScenarios">mdi-triangle mdi-rotate-270</v-icon>
                  <v-icon v-if="showMissingScenarios" size="10" color="white" @click="showMissingScenarios = !showMissingScenarios">mdi-triangle mdi-rotate-180</v-icon>
              </v-col>
            </v-row>
            <!-- Legend categories as v-for -->
            <v-row v-if="showMissingScenarios" no-gutters
                   v-for="layerName in missingInputScenarios"
                   class="mb-2 ml-0"
                   style=""
            >
              <v-col cols="2" xs="3">
                <v-card
                  class="mr-2"
                  tile
                  dark
                  style=""
                >
                  <v-icon :color="'white'">mdi-close</v-icon>
                </v-card>
              </v-col>
              <v-col cols="3" xs="9">
                <v-card
                  class="pa-0"
                  tile
                  dark
                  style="background-color: inherit"
                >
                  {{ layerName }}
                </v-card>
              </v-col>
              <v-col cols="7" xs="12">
                <v-card
                  class="pa-0"
                  tile
                  dark
                  style="background-color: inherit"
                >
                  <v-btn
                    @click="loadDefaultResultFor(layerName)"
                    class="confirm_btn"
                    :class="{ changesMade : resultOutdated }"
                    :disabled="resultLoading"
                    style="min-width: 100%;"
                  >Load Default
                  </v-btn>
                </v-card>
              </v-col>
            </v-row>
          </div> <!-- end of missing scenarios -->
        </div> <!-- scenario box -->

      <!-- Criteria Selection --->
      <div v-if="layersReadyToCompare.length >= 2" class="scenario_box" :class="resultOutdated ? 'highlight' : ''">
        <header class="text-sm-left">CRITERIA SELECTION</header>
        <v-row style="margin-bottom: -10px;">
          <v-col cols="10">
            <v-card
              class="pa-0"
              tile
              dark
              style="background-color: transparent;"
            >
              <header
                class="text-sm-left"
                v-bind:class="enableCriteriaLayer_1 ? '' : 'disabled'"
                style="font-weight: bold;">
                {{ layerChoice_1 }}
              </header>
              <p style="float: left; font-size:11px;">{{ getScenarioDescriptionFor(layerChoice_1) }}</p>
            </v-card>
          </v-col>
          <v-col cols="2">
            <v-icon v-if="!enableCriteriaLayer_1" color="grey" @click="enableCriteriaLayer_1 = !enableCriteriaLayer_1">mdi-eye-off</v-icon>
            <v-icon v-if="enableCriteriaLayer_1" color="white" @click="enableCriteriaLayer_1 = !enableCriteriaLayer_1">mdi-eye</v-icon>
          </v-col>
        </v-row>
        <!-- criteria 1 select -->
        <v-row no-gutters align="start">
          <v-select
            :disabled="!enableCriteriaLayer_1"
            :items="criteriaOptions_1"
            v-model="criteriaChoice_1"
            @change="inputChanged()"
            item-text="label"
            item-value="label"
            :hint="`${criteriaChoice_1.unit}` || ''"
            :label="criteriaChoice_1.label"
            solo
            persistent-hint
            return-object
            single-line
            dark
            hide-details
            ></v-select>
        </v-row>
        <!--- criteria 1 - preset select -->
        <v-row no-gutters>
          <v-select
            :disabled="!enableCriteriaLayer_1"
            :items="Object.keys(presetOptions)"
            v-model="preset_1"
            @change="inputChanged(); sliderValues_1 = getValueForPreset(preset_1, criteriaChoice_1.range)"
            item-text="label"
            item-value="label"
            solo
            persistent-hint
            :hint="`${criteriaChoice_1.unit}` || ''"
            return-object
            single-line
            dark
          ></v-select>
        </v-row>
        <!-- criteria 1 - slider -->
        <v-row no-gutters align="center">
          <v-col style="margin-top: -35px;">
            <v-range-slider
              :disabled="!enableCriteriaLayer_1 || this.preset_1 !== 'Custom'"
              @dragstart="_ => null"
              @dragend="_ => null"
              @mousedown.native.stop="_ => null"
              @mousemove.native.stop="_ => null"
              @change="inputChanged()"
              v-model="sliderValues_1"
              :step="criteriaChoice_1.step"
              :hint="'Subselection has ' + criteriaLayer_1.features.length + ' features'"
              label=""
              persistent-hint
              thumb-label="always"
              thumb-size="1"
              tick-size="50"
              :min="criteriaChoice_1.range[0]"
              :max="criteriaChoice_1.range[1]"
              dark
              flat
            ></v-range-slider>
          </v-col>
        </v-row>

        <!-- second criteria --->
        <!-- criteria 2 - headline -->
        <v-row no-gutters class="mt-5">
          <v-col cols="10">
            <v-card
              class="pa-0"
              tile
              dark
              style="background-color: transparent;"
            >
              <header
                class="text-sm-left"
                v-bind:class="enableCriteriaLayer_2 ? '' : 'disabled'"
                style="font-weight: bold;"
              >
                {{ layerChoice_2 }}
              </header>
              <p style="float: left; font-size:11px;">{{ getScenarioDescriptionFor(layerChoice_2) }}</p>
            </v-card>
          </v-col>
          <v-col cols="2">
            <v-icon v-if="!enableCriteriaLayer_2" color="grey" @click="enableCriteriaLayer_2 = !enableCriteriaLayer_2">mdi-eye-off</v-icon>
            <v-icon v-if="enableCriteriaLayer_2" color="white" @click="enableCriteriaLayer_2 = !enableCriteriaLayer_2">mdi-eye</v-icon>
          </v-col>
        </v-row>
        <!-- criteria 2 - select -->
        <v-row no-gutters align="start">
          <v-select
            :disabled="!enableCriteriaLayer_2"
            :items="criteriaOptions_2"
            v-model="criteriaChoice_2"
            @change="inputChanged()"
            item-text="label"
            item-value="label"
            :label="criteriaChoice_2.label"
            solo
            persistent-hint
            return-object
            single-line
            dark
            hide-details
          ></v-select>
        </v-row>
        <!-- criteria 2 - preset select -->
          <v-row no-gutters align="start">
            <v-select
              :disabled="!enableCriteriaLayer_2"
              :items="Object.keys(presetOptions)"
              v-model="preset_2"
              @change="inputChanged(); sliderValues_2 = getValueForPreset(preset_2, criteriaChoice_2.range)"
              item-text="label"
              item-value="label"
              solo
              persistent-hint
              return-object
              single-line
              dark
              :hint="`${criteriaChoice_2.unit}` || ''"
            ></v-select>
        <!-- criteria 2 - slider -->
          <v-row no-gutters align="center">
            <v-col style="margin-top: -35px;">
              <v-range-slider
                :disabled="!enableCriteriaLayer_2 || this.preset_2 !== 'Custom'"
                @dragstart="_ => null"
                @dragend="_ => null"
                @mousedown.native.stop="_ => null"
                @mousemove.native.stop="_ => null"
                @change="inputChanged()"
                v-model="sliderValues_2"
                :step="criteriaChoice_2.step"
                :hint="'Subselection has ' + criteriaLayer_2.features.length + ' features'"
                persistent-hint
                thumb-label="always"
                label=""
                thumb-size="1"
                tick-size="50"
                :min="criteriaChoice_2.range[0]"
                :max="criteriaChoice_2.range[1]"
                dark
                flat
              ></v-range-slider>
            </v-col>
          </v-row>

          </v-row>
          <v-row align="center" class="mt-8">
            <p v-if="showError" class="warning">Invalid selection</p>
            <p v-if="emptyDataWarning" class="warning">No data to show!</p>
            <v-btn
              @click="showCombinedLayers"
              class="confirm_btn"
              :class="{ changesMade : resultOutdated }"
              :disabled="emptyDataWarning || showError"
            >
             Visualize Selection
            </v-btn>
          </v-row>
        </div> <!-- v-if="allDataProvided" end -->

       </v-container>

        </div>
        <v-overlay :value="resultLoading">
          <div>Loading results</div>
          <v-progress-linear>...</v-progress-linear>
        </v-overlay>
      </div>  <!--component_content end-->
    </div><!--division end-->
</template>



<style scoped lang="scss">
    @import "../../style.main.scss";
    p.warning {
      color: darkred;
      margin: auto;
    }


    h2.disabled {
      color: gray !important;
    }



</style>
