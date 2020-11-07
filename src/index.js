import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   // javascriptのクラスでは、サブクラス（子クラス or 子コンポーネント）のコンストラクタを定義する時、常にsuperを呼ぶ必要がある。
//   // Reactのクラスコンポーネントでは全てのコンストラクタをsuper(props)の呼び出しから始めるべき。
//   // stateの管理をする必要がなくなったのでコンストラクタを削除する
//   // constructor(props) {
//   //   super(props);
//   //   this.state = {
//   //     value: null,
//   //   }
//   // }
//   // 親から渡されたpropsをbuttonにセットしていると数字を表示する
//   // propsとstateは別物と考える（別の変数というイメージ）
//   // propsをstateに設定すると、setStateで呼び出した値がstateにセット('X')されて、Squareコンポーネントが再レンダリングされる
//   // 親の関数を呼び出して、親のstateを変更するので、propsで渡ってきたvalueとonClickを利用する(渡ってきたpropsの確認はReactDevToools)
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }



// SquareComponentを関数コンポーネントに書き換える
function Square(props) {
  return (
    <button className="square"　onClick={props.onClick}>
      {props.value}
    </button>
  );
}


// Boardコンポーネントは親
// 子コンポーネントのSquareにpropsを渡す
class Board extends React.Component {
  // 状態をリフトアップするので削除
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   }
  // }

  // handleClick()メソッドもGameコンポーネントに移動することで、Boardコンポーネントがロジックと状態を持たないコンポーネントになる。
  // handleClick(i) {
  //   const squares = this.state.squares.slice();
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }
  //   squares[i] = this.state.xIsNext ? 'X' : 'O';
  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    // Gameコンポーネントにステータス表示の責務が移ったので、renderメソッド内から削除できる
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if(winner) {
    //   status = 'Winner: ' + winner;
    // } else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // }

    return (
      <div>
        {/* <div className="status">{status}</div> */}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    // ボタンをクリックして、過去の時点に戻ったときに、その時点より未来の履歴を捨て去ることができる。
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      // concatはpushと違い、元の配列をミューテートしないためこちらを利用する。
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }


  // constructorには初期値をセットする
  // renderの中に変数を定義して値を代入していく
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} >
            {desc}
          </button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    // 子コンポーネントの持つstateのkey名がpropsとしての名前になる
      // squares={current.squares} -> key={value}
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


// stateをリフトアップすることで、子コンポーネントが制御されたコンポーネントとなる。-> presentational components？ 状態やロジックを持たないcomponents
// オブジェクトをイミュータブルに保つ。複雑な機能の実装が簡単になる。変更の検出が容易になるため。
// 関数コンポーネントとは、renderメソッドだけを有し、stateをを持たないコンポーネント
  // React．Componentを継承するクラスを定義する代わりに、propsを入力として受け取り、表示すべき内容を返す関数を定義する。
  // 状態やロジックを持たないコンポーネントを作ることで関数コンポーネントを作り出すことができる。controlled components -> functional conmponents
// 破壊的、非破壊的、新しいオブジェクトを返すイミュータブルなメソッド
// 動的なliを作成するときは、keyを設定することで何をサイレンリングしないといけないか、reactに知らせることができる
  // indexをkeyにしてしまうと項目を並び替えたり、挿入/削除の原因となってしまうため避けるべき、一般にはdbにあるidを参照するようにすると良い
  // keyはグローバルに一意である必要はなく、兄弟の間で一意であれば良い
