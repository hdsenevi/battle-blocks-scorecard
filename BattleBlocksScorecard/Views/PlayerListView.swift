//
//  PlayerListView.swift
//  BattleBlocksScorecard
//
//  Created by Shanaka Senevirathne on 28/12/2023.
//

import SwiftUI
import SwiftData

struct PlayerListView: View {
    @Environment(\.dismiss) var dismiss
    @Environment(\.modelContext) var modelContext
    
    @Bindable var game: Game
    @Query var players: [Player]
    
    @State private var selection = Set<Player>()
    @State private var editMode = EditMode.active
    
    var body: some View {
        VStack {
            Text("\(selection.count) Players selected")
            Spacer()
            List(selection: $selection) {
                ForEach(players, id: \.self){ player in
                    Text(player.name)
                }
                .onDelete(perform: deletePlayer)
            }
            Spacer()
            NavigationLink {
                AddPlayersView()
            } label: {
                Text("Add new player")
            }
            Spacer()
        }
        .navigationTitle("Add Players to game")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .confirmationAction) {
                Button("Done", action: doneAction)
                    .disabled(selection.count == 0)
            }
        }
        .environment(\.editMode, $editMode)
    }
    
    func doneAction() {
        game.players = Array(selection)
        try? modelContext.save()
        dismiss()
    }
    
    func deletePlayer(_ indexSet: IndexSet) {
        for index in indexSet {
            let playerToDelete = players[index]
            modelContext.delete(playerToDelete)
        }
    }
}

#Preview {
    do {
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        let container = try ModelContainer(for: Game.self, configurations: config)
        
        let player1 = Player(name: "Shana")
        container.mainContext.insert(player1)
        let player2 = Player(name: "Diya")
        container.mainContext.insert(player2)
        
        let example = Game(
            name: "Sha's place",
            startTime: .now,
            endTime: .now,
            players: [player1, player2]
        )
        return NavigationView {
            PlayerListView(game: example)
        }
        .modelContainer(container)
    } catch {
        fatalError("Failed to create model container.")
    }
}
