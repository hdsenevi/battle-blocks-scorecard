//
//  Game.swift
//  BattleBlocksScorecard
//
//  Created by Shanaka Senevirathne on 24/12/2023.
//

import Foundation
import SwiftData

@Model
class Game {
    var name: String
    var startTime: Date
    var endTime: Date
    @Relationship(deleteRule: .cascade) var rounds = [Round]()
    @Relationship(deleteRule: .noAction) var players = [Player]()
    
    init(name: String = "", startTime: Date = .now, endTime: Date = .now, rounds: [Round] = [], players: [Player] = []) {
        self.name = name
        self.startTime = startTime
        self.endTime = endTime
        self.rounds = rounds
        self.players = players
    }
}
