import './App.css';
import app from './Qlik/QlikConnection'

function App() {

  app.then(app => {
    console.log('App importado', app)
    app.getList('FieldList',(reply) => {
      console.log('Lista de campos do app:', reply)
    })
  })

  return (
    <div className="App">
    </div>
  );
}

export default App;
