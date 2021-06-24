import copyCode from '../assets/images/copy.svg'

import '../styles/room-code.scss'

type RoomCodeProps = {
  code: string
}

export const RoomCode = ({ code }: RoomCodeProps) => {

  function copyRoomToClipboard() {
    navigator.clipboard.writeText(code)
  }
  return (
    <button onClick={copyRoomToClipboard} className="room-code">
      <div>
        <img src={copyCode} alt="Copy room code" />
      </div>
      <span>Sala #{code}</span>
    </button>
  );
}