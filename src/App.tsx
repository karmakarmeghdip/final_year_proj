import FakeNewsInput from './components/FakeNewsInput';
import AnalysisResultView from './components/AnalysisResultView';
import { useAtom } from 'jotai';
import { currentViewAtom } from './store/atoms';
import "./App.css";

function App() {
  const [currentView] = useAtom(currentViewAtom);

  return (
    <>
      {currentView === 'input' ? <FakeNewsInput /> : <AnalysisResultView />}
    </>
  );
}

export default App;
