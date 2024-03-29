import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import 'antd/dist/antd.css'
import DownloadsDashboard from './DownloadsDashboard'
import ExploreDataDashboard from './ExploreData'
import DatasetDashboard from './Dataset'

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <Router>
        <Switch>
          <Route path="/dataset/:id">
            <DatasetDashboard />
          </Route>
          <Route path="/explore-data">
            <ExploreDataDashboard />
          </Route>
          <Route path="/">
            <DownloadsDashboard />
          </Route>
        </Switch>
      </Router>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)
