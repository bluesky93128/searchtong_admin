<template>
<div>
    <ul :class="`nav nav-tabs ${navClass}`">
        <li :class="{'nav-item':true,'step-doing': tab.isActive, 'step-done':tab.isDone }" v-for="(tab,tabIndex) in tabs" v-bind:key="tab.name" v-if="tab.type!='done'">
            <a :class="{
                'nav-link':true,
                'disabled':topNavDisabled
            }" href="#" @click.prevent="clickedTab(tabIndex)">
                <span>{{tab.name}}</span>
                <small>{{tab.desc}}</small>
            </a>
        </li>
    </ul>
    <slot></slot>
    <div :class="`wizard-buttons ${navClass}`" v-if="!(lastStepEnd && isCompleted)">
        <button type="button" class="mr-1 btn btn-primary" :disabled="!currentActive > 0" @click="previousTab()">
            {{$t('wizard.prev')}}
        </button>
        <button type="button" class="mr-1 btn btn-primary" @click="save()">
            {{$t('wizard.save')}}
        </button>
        <button type="button" class="btn btn-primary" v-if="currentActive != totalTabs - 1" :disabled="currentActive > totalTabs - 1" @click="nextTab()">
            {{$t('wizard.next')}}
        </button>
        <button type="button" class="btn btn-primary" v-if="currentActive == totalTabs - 1" @click="register()">
            {{$t('wizard.register')}}
        </button>
    </div>
</div>
</template>

<script>
export default {
    name: "form-wizard",
    props: {
        navClass: {
            default: "justify-content-center"
        },
        lastStepEnd: {
            default: false
        },
        topNavDisabled: {
            default: false
        },
        withValidate: {
            default: false
        },
        save: {
            type: Function,
            default: () => {
                console.log("Save button clicked!")
            }
        },
        done: {
            type: Function,
            default: () => {
                console.log("called done!")
            }
        },
        data: {
            default: {}
        }
    },
    data() {
        return {
            tabs: [],
            currentActive: 0,
            totalTabs: 0,
            isCompleted: false
        };
    },

    created() {
        this.tabs = this.$children;
    },
    mounted() {
        this.totalTabs = this.tabs.filter(x => x.type != "done").length;
    },
    methods: {
        tabStatusFix() {
            this.tabs.forEach((tab, tabIndex) => {
                let isDone = tab.isDone;
                if (!isDone) {
                    isDone = this.currentActive > tabIndex;
                }
                tab.isDone = isDone;
                tab.isActive = false;
            });
        },
        clickedTab(tabIndex) {
            if (!this.topNavDisabled) {
                if(!this.data.title || !this.data.title.length) {
                    alert("제목을 입력하세요.")
                    return;
                }
                if (!(this.lastStepEnd && this.isCompleted)) {
                    this.currentActive = tabIndex;
                    this.tabStatusFix();
                    this.tabs[this.currentActive].isActive = true;
                }
            }
        },
        register() {
            console.log('data = ', this.data);
            if((new Date(this.data.startAt) < new Date()) && !this.data.isSetPeriodLater) {
                if(confirm('진행 시작일이 지났습니다. 지금 바로 진행을 시작하시겠습니까?')) {
                    this.data.isDraft = false;
                    this.data.status = 0;
                    this.save();
                    this.$router.push('/app/research/manage');
                } else {
                    this.clickedTab(0);
                }
            } else {
                this.data.isDraft = false;
                if(this.data.isSetPeriodLater) {
                    this.data.status = 2;
                } else {
                    this.data.status = 1;
                }
                this.save();
                this.$router.push('/app/research/manage');
            }
            
        },
        saveData() {
            this.save();
        },
        previousTab() {
            this.currentActive--;
            this.tabStatusFix();
            this.tabs[this.currentActive].isActive = true;
        },

        nextTab() {
            this.totalTabs = this.tabs.filter(x => x.type != "done").length;
            let valid = true;
            if (this.withValidate) {
                valid = this.tabs[this.currentActive].validate();
                if (valid) this.tabs[this.currentActive].submit();
            }

            if(!this.data.title || !this.data.title.length) {
                alert("제목을 입력하세요.")
                valid = false;
            }

            if(this.data.endAt < this.data.startAt) {
                alert("진행기간을 정확히 입력하세요.")
                valid = false;
            }

            if (valid) {
                if(this.currentActive == 0 && !this.data._id) {
                    this.save();
                }
                this.currentActive++;
                this.tabStatusFix();
                if (this.currentActive >= this.totalTabs) {
                    this.isCompleted = true;
                    const doneTab = this.tabs.find(x => x.type == "done");
                    if (doneTab) {
                        doneTab.isActive = true;
                    } else this.tabs[this.currentActive - 1].isActive = true;
                    this.done();
                } else this.tabs[this.currentActive].isActive = true;
            }
        }
    }
};
</script>
