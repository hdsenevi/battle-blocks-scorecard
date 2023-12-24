//
//  BattleBlocksScorecardApp.swift
//  BattleBlocksScorecard
//
//  Created by Shanaka Senevirathne on 23/12/2023.
//

import SwiftUI
import SwiftData

@main
struct BattleBlocksScorecardApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: Game.self)
    }
}
